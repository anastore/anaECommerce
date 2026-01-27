import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for managing internationalization (i18n) and UI direction.
 * Supports English (LTR) and Arabic (RTL).
 */
@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    /** Observation for UI layout direction updates. */
    private dirSubject = new BehaviorSubject<'ltr' | 'rtl'>('ltr');
    dir$ = this.dirSubject.asObservable();

    constructor(private translate: TranslateService) {
        // Load initial language preference from storage
        const savedLang = localStorage.getItem('language') || 'en';
        this.setLanguage(savedLang);
    }

    /**
     * Updates the current active language and toggles UI direction.
     * @param lang Culture code (e.g., 'en', 'ar').
     */
    setLanguage(lang: string) {
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        this.translate.use(lang);
        localStorage.setItem('language', lang);

        // Update DOM attributes for global CSS support
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
        this.dirSubject.next(dir);
    }

    /** Returns the current culture code. */
    getCurrentLanguage(): string {
        return this.translate.currentLang || 'en';
    }

    /** Cycles between English and Arabic. */
    toggleLanguage() {
        const newLang = this.getCurrentLanguage() === 'en' ? 'ar' : 'en';
        this.setLanguage(newLang);
    }
}

