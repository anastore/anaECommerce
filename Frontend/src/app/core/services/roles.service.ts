import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Role {
    id: string;
    name: string;
    userCount: number;
}

export interface CreateRole {
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class RolesService {
    private apiUrl = 'http://localhost:5001/api/roles';

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

    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    createRole(role: CreateRole): Observable<any> {
        return this.http.post(this.apiUrl, role, { headers: this.getHeaders() });
    }

    updateRole(id: string, role: CreateRole): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, role, { headers: this.getHeaders() });
    }

    deleteRole(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
