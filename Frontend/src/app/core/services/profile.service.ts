import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

export interface Address {
    id: number;
    addressType: string;
    country: string;
    state: string;
    city: string;
    streetAddress: string;
    isDefault: boolean;
}

export interface PaymentMethod {
    id: number;
    cardBrand: string;
    last4: string;
    isDefault: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiUrl = `${environment.apiUrl}/profile`;

    constructor(private http: HttpClient) { }

    getProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(this.apiUrl + '/GetProfile');
    }

    updateProfile(profile: any): Observable<any> {
        return this.http.put(this.apiUrl + '/UpdateProfile', profile);
    }

    addAddress(address: any): Observable<Address> {
        return this.http.post<Address>(`${this.apiUrl}/addresses`, address);
    }

    deleteAddress(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/addresses/${id}`);
    }

    getPaymentMethods(): Observable<PaymentMethod[]> {
        return this.http.get<PaymentMethod[]>(`${this.apiUrl}/GetPaymentMethods`);
    }

    uploadImage(file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<{ imageUrl: string }>(`${environment.apiUrl}/upload/image`, formData);
    }
}
