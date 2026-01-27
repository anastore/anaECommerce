import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService, UserProfile, Address } from '../../core/services/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    profileForm: FormGroup;
    addressForm: FormGroup;
    userProfile: UserProfile | null = null;
    loading = true;
    showAddressForm = false;
    isEditMode = false;

    countryCodes = [
        { code: '+20', name: 'Egypt', flag: '🇪🇬' },
        { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
        { code: '+971', name: 'UAE', flag: '🇦🇪' },
        { code: '+1', name: 'USA', flag: '🇺🇸' },
        { code: '+44', name: 'UK', flag: '🇬🇧' }
    ];

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private snackBar: MatSnackBar
    ) {
        this.profileForm = this.fb.group({
            fullName: ['', Validators.required],
            countryCode: ['+20'],
            phoneNumber: [''],
            profilePictureUrl: [''],
            birthDate: [''],
            gender: ['']
        });

        this.addressForm = this.fb.group({
            addressType: ['Home', Validators.required],
            country: ['', Validators.required],
            state: ['', Validators.required],
            city: ['', Validators.required],
            streetAddress: ['', Validators.required],
            isDefault: [false]
        });
    }

    ngOnInit(): void {
        this.loadProfile();
    }

    getImageUrl(url?: string): string {
        if (!url) return 'assets/images/default-avatar.png';
        if (url.startsWith('http')) return url;
        return `${environment.imageBaseUrl}${url}`;
    }

    loadProfile() {
        this.loading = true;
        this.profileService.getProfile().subscribe({
            next: (profile) => {
                this.userProfile = profile;

                let detectedCode = '+20';
                let detectedNumber = profile.phoneNumber || '';

                const matched = this.countryCodes.find((c: any) => profile.phoneNumber?.startsWith(c.code));
                if (matched) {
                    detectedCode = matched.code;
                    detectedNumber = profile.phoneNumber.substring(matched.code.length);
                }

                this.profileForm.patchValue({
                    fullName: profile.fullName,
                    countryCode: detectedCode,
                    phoneNumber: detectedNumber,
                    profilePictureUrl: profile.profilePictureUrl,
                    birthDate: profile.birthDate,
                    gender: profile.gender
                });
                this.loading = false;
            },
            error: (err) => {
                this.snackBar.open('Error loading profile', 'Close', { duration: 3000 });
                this.loading = false;
            }
        });
    }

    toggleEdit() {
        this.isEditMode = !this.isEditMode;
        if (!this.isEditMode) {
            this.loadProfile(); // Reset changes if cancelled
        }
    }

    setCountryCode(code: string): void {
        this.profileForm.patchValue({ countryCode: code });
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.profileService.uploadImage(file).subscribe({
                next: (res) => {
                    const profileData = {
                        ...this.profileForm.getRawValue(),
                        profilePictureUrl: res.imageUrl,
                        phoneNumber: this.profileForm.value.countryCode + this.profileForm.value.phoneNumber
                    };
                    delete profileData.countryCode;

                    this.profileService.updateProfile(profileData).subscribe({
                        next: () => {
                            this.snackBar.open('Profile picture updated', 'Close', { duration: 3000 });
                            this.loadProfile();
                        }
                    });
                },
                error: (err) => {
                    this.snackBar.open('Upload failed', 'Close', { duration: 3000 });
                }
            });
        }
    }

    saveProfile() {
        if (this.profileForm.valid) {
            const profileData = {
                ...this.profileForm.value,
                phoneNumber: this.profileForm.value.countryCode + this.profileForm.value.phoneNumber
            };
            delete profileData.countryCode;

            this.profileService.updateProfile(profileData).subscribe({
                next: () => {
                    this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
                    this.isEditMode = false;
                    this.loadProfile();
                },
                error: (err) => {
                    this.snackBar.open('Error updating profile', 'Close', { duration: 3000 });
                }
            });
        }
    }

    addAddress() {
        if (this.addressForm.valid) {
            this.profileService.addAddress(this.addressForm.value).subscribe({
                next: () => {
                    this.snackBar.open('Address added successfully', 'Close', { duration: 3000 });
                    this.showAddressForm = false;
                    this.addressForm.reset({ addressType: 'Home' });
                    this.loadProfile();
                },
                error: () => {
                    this.snackBar.open('Error adding address', 'Close', { duration: 3000 });
                }
            });
        }
    }

    deleteAddress(id: number) {
        if (confirm('Are you sure you want to delete this address?')) {
            this.profileService.deleteAddress(id).subscribe({
                next: () => {
                    this.snackBar.open('Address deleted', 'Close', { duration: 3000 });
                    this.loadProfile();
                }
            });
        }
    }
}
