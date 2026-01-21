import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResult } from '../models/ecommerce.models';

export interface User {
    id: string;
    userName: string;
    email: string;
    fullName: string;
    roles?: string[]; // Made optional/compatible with both
    role?: string;    // Added from UsersService
    isActive?: boolean;
    emailConfirmed?: boolean;
    lockoutEnabled?: boolean;
    lockoutEnd?: Date;
}

export interface UpdateUser {
    fullName: string;
    email: string;
}

export interface AssignRole {
    roleName: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    getUsers(pageNumber: number = 1, pageSize: number = 10, search?: string): Observable<PaginatedResult<User>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<PaginatedResult<User>>(this.apiUrl, { params });
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getUserById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    updateUser(id: string, user: UpdateUser | any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, user);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    assignRole(userId: string, role: AssignRole | string): Observable<any> {
        // Backend might expect different formats, supporting both for safety
        const body = typeof role === 'string' ? { role } : role;
        const endpoint = typeof role === 'string' ? `${this.apiUrl}/${userId}/roles` : `${this.apiUrl}/${userId}/role`;
        return this.http.put(endpoint, body);
    }
}
