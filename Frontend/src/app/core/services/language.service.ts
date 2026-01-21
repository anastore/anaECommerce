import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private dirSubject = new BehaviorSubject<'ltr' | 'rtl'>('ltr');
    dir$ = this.dirSubject.asObservable();

    constructor(private translate: TranslateService) {
        const savedLang = localStorage.getItem('language') || 'en';
        this.setLanguage(savedLang);
    }

    setLanguage(lang: string) {
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        this.translate.use(lang);
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
        this.dirSubject.next(dir);
    }

    getCurrentLanguage(): string {
        return this.translate.currentLang || 'en';
    }

    toggleLanguage() {
        const newLang = this.getCurrentLanguage() === 'en' ? 'ar' : 'en';
        this.setLanguage(newLang);
    }
}

