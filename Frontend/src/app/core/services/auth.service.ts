import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Core Authentication Service.
 * Manages user sessions, JWT storage in local storage, and role-based access checks.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  /** Registers a new account. */
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  /**
   * Logs in a user and stores the token on success.
   * @param credentials Login payload (email, password).
   */
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  /** Retrieves the stored JWT from browser storage. */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Clears the session and removes the JWT. */
  logout(): void {
    localStorage.removeItem('token');
  }

  /** Returns true if a valid, non-expired token exists. */
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /** Decodes the JWT to extract the user's role claim. */
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) return null;

    try {
      // Decode JWT payload (standard Identity claim URI)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch {
      return null;
    }
  }

  /** Convenience method for admin checks. */
  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  /** Checks if the token's 'exp' claim is in the past. */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;

      const expiryTime = payload.exp * 1000;
      return Date.now() > expiryTime;
    } catch {
      return true;
    }
  }
}
