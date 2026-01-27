import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';

/**
 * Universal app header.
 * Provides navigation, search, and session controls (Login/Logout).
 * Also hosts the language switcher.
 */
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    constructor(
        public authService: AuthService,
        public languageService: LanguageService,
        private router: Router
    ) { }

    /** Returns current auth state from the core service. */
    get isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    /** Returns current culture code (e.g., 'en'). */
    get currentLanguage(): string {
        return this.languageService.getCurrentLanguage();
    }

    /** Toggles between LTR and RTL modes. */
    toggleLanguage() {
        this.languageService.toggleLanguage();
    }

    /** Clears session and redirects to login. */
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    /** Navigation helper for login page. */
    login() {
        this.router.navigate(['/login']);
    }
}
