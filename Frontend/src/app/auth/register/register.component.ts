import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

import { ProfileService } from '../../core/services/profile.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    accountForm: FormGroup;
    addressForm: FormGroup;
    hide = true;
    loading = false;
    imagePreview: string | null = null;
    selectedFile: File | null = null;

    getImageUrl(url?: string | null): string {
        if (!url) return 'assets/images/default-avatar.png';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `${environment.imageBaseUrl}${url}`;
    }

    countryCodes = [
        { code: '+20', name: 'Egypt', flag: '🇪🇬' },
        { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
        { code: '+971', name: 'UAE', flag: '🇦🇪' },
        { code: '+1', name: 'USA', flag: '🇺🇸' },
        { code: '+44', name: 'UK', flag: '🇬🇧' }
    ];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private profileService: ProfileService
    ) {
        this.accountForm = this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            countryCode: ['+20'],
            phoneNumber: [''],
            profilePictureUrl: [''],
            role: ['Client', Validators.required]
        });

        this.addressForm = this.fb.group({
            country: ['', Validators.required],
            state: [''],
            city: ['', Validators.required],
            streetAddress: ['', Validators.required]
        });
    }

    triggerFileInput(input: HTMLInputElement): void {
        input.click();
    }

    setCountryCode(code: string): void {
        this.accountForm.patchValue({ countryCode: code });
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            // Show preview
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        console.log('Account Form Valid:', this.accountForm.valid);
        console.log('Account Form Values:', this.accountForm.value);
        console.log('Address Form Valid:', this.addressForm.valid);

        if (this.accountForm.valid && this.addressForm.valid) {
            this.loading = true;

            if (this.selectedFile) {
                this.profileService.uploadImage(this.selectedFile).subscribe({
                    next: (res) => {
                        this.accountForm.patchValue({ profilePictureUrl: res.imageUrl });
                        this.completeRegistration();
                    },
                    error: (err) => {
                        this.loading = false;
                        console.error('Upload failed:', err);
                        alert('Critical Error: Profile picture upload failed. Registration aborted. Please try again with a different image or contact support.');
                        // DO NOT call completeRegistration() here to satisfy "No silent failures" rule
                    }
                });
            } else {
                this.completeRegistration();
            }
        } else {
            alert('Please fill all required fields correctly.');
        }
    }

    private completeRegistration(): void {
        const registrationData = {
            ...this.accountForm.value,
            ...this.addressForm.value,
            phoneNumber: this.accountForm.value.phoneNumber ?
                (this.accountForm.value.countryCode + this.accountForm.value.phoneNumber) :
                null
        };
        delete registrationData.countryCode;

        this.authService.register(registrationData).subscribe({
            next: () => {
                this.loading = false;
                alert('Registration successful! Please login.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.loading = false;
                console.error('Registration error:', err);
                alert('Registration failed: ' + (err.error?.message || 'Check your details'));
            }
        });
    }
}
