import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Global HTTP Error Interceptor.
 * Catches 401/403 responses to trigger automatic logout and redirects.
 * Formats and propagates error messages to components.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(err => {
                // Security: Trigger logout if session has expired or access is denied
                if ([401, 403].includes(err.status)) {
                    this.authService.logout();
                    this.router.navigate(['/login']);
                }

                // Extract user-friendly error message if available
                const error = err.error?.message || err.statusText;
                return throwError(() => error);
            })
        );
    }
}
