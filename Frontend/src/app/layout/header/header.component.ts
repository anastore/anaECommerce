import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';

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

    get isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    get currentLanguage(): string {
        return this.languageService.getCurrentLanguage();
    }

    toggleLanguage() {
        this.languageService.toggleLanguage();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    login() {
        this.router.navigate(['/login']);
    }
}
