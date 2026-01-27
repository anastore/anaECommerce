import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/** Security role metadata. */
export interface Role {
    id: string;
    name: string;
    userCount: number;
}

/** Payload for creating a new role. */
export interface CreateRole {
    name: string;
}

/**
 * Service for administrative role management.
 * Note: Uses manual headers; may be refactored to rely on JwtInterceptor.
 */
@Injectable({
    providedIn: 'root'
})
export class RolesService {
    private apiUrl = 'http://localhost:5001/api/roles';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    /** Helper function to manually attach auth headers. */
    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    /** Lists all security roles. */
    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    /** Admin: Creates a new role. */
    createRole(role: CreateRole): Observable<any> {
        return this.http.post(this.apiUrl, role, { headers: this.getHeaders() });
    }

    /** Admin: Renames a role. */
    updateRole(id: string, role: CreateRole): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, role, { headers: this.getHeaders() });
    }

    /** Admin: Deletes a role if no users are assigned. */
    deleteRole(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
