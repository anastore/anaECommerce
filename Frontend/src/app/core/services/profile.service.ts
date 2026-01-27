import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** User profile details including identity and linked entities. */
export interface UserProfile {
    fullName: string;
    email: string;
    phoneNumber: string;
    profilePictureUrl: string;
    birthDate: string;
    gender: string;
    addresses: Address[];
    paymentMethods: PaymentMethod[];
}

/** Physical address associated with a user. */
export interface Address {
    id: number;
    addressType: string;
    country: string;
    state: string;
    city: string;
    streetAddress: string;
    isDefault: boolean;
}

/** Partial payment method info for the user. */
export interface PaymentMethod {
    id: number;
    cardBrand: string;
    last4: string;
    isDefault: boolean;
}

/**
 * Service for the user to manage their personal profile, addresses, and payment preferences.
 */
@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiUrl = `${environment.apiUrl}/profile`;

    constructor(private http: HttpClient) { }

    /** Retrieves the full profile of the logged-in user. */
    getProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(this.apiUrl + '/GetProfile');
    }

    /** Updates personal details on the user's profile. */
    updateProfile(profile: any): Observable<any> {
        return this.http.put(this.apiUrl + '/UpdateProfile', profile);
    }

    /** Adds a new address to the user's account. */
    addAddress(address: any): Observable<Address> {
        return this.http.post<Address>(`${this.apiUrl}/addresses`, address);
    }

    /** Deletes a specific address by ID. */
    deleteAddress(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/addresses/${id}`);
    }

    /** Retrieves the user's saved payment methods. */
    getPaymentMethods(): Observable<PaymentMethod[]> {
        return this.http.get<PaymentMethod[]>(`${this.apiUrl}/GetPaymentMethods`);
    }

    /** Uploads a new profile picture. */
    uploadImage(file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<{ imageUrl: string }>(`${environment.apiUrl}/upload/image`, formData);
    }
}
