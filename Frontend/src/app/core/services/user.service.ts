import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResult } from '../models/ecommerce.models';

/** Represents a user record for administrative management. */
export interface User {
    id: string;
    userName: string;
    email: string;
    fullName: string;
    roles?: string[];
    role?: string;
    isActive?: boolean;
    emailConfirmed?: boolean;
    lockoutEnabled?: boolean;
    lockoutEnd?: Date;
}

/** Payload for updating user basics. */
export interface UpdateUser {
    fullName: string;
    email: string;
}

/** Payload for role assignment. */
export interface AssignRole {
    roleName: string;
}

/**
 * Service for administrative user and role oversight.
 * Exclusive for users with high-level privileges.
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    /** Lists all registered users with search capabilities. */
    getUsers(pageNumber: number = 1, pageSize: number = 10, search?: string): Observable<PaginatedResult<User>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<PaginatedResult<User>>(this.apiUrl, { params });
    }

    /** Gets account details and security status for a user. */
    getUserById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    /** Admin: Updates a user's account details. */
    updateUser(id: string, user: UpdateUser | any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, user);
    }

    /** Admin: Hard deletes a user record. */
    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    /**
     * Admin: Assigns a new security role to a user.
     * @param userId The unique ID of the user.
     * @param role The role name or assignment DTO.
     */
    assignRole(userId: string, role: AssignRole | string): Observable<any> {
        const body = typeof role === 'string' ? { role } : role;
        const endpoint = typeof role === 'string' ? `${this.apiUrl}/${userId}/roles` : `${this.apiUrl}/${userId}/role`;
        return this.http.put(endpoint, body);
    }
}
