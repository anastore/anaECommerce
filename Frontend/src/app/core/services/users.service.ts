import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    emailConfirmed: boolean;
    lockoutEnabled: boolean;
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
export class UsersService {
    private apiUrl = 'http://localhost:5001/api/users';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    getUser(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    updateUser(id: string, user: UpdateUser): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() });
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    assignRole(id: string, role: AssignRole): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/role`, role, { headers: this.getHeaders() });
    }
}
