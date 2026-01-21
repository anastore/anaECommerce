import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
    icon: string;
    label: string;
    route: string;
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    menuItems: MenuItem[] = [
        { icon: 'dashboard', label: 'SIDEBAR.DASHBOARD', route: '/admin/dashboard' },
        { icon: 'category', label: 'SIDEBAR.CATEGORIES', route: '/admin/categories' },
        { icon: 'subdirectory_arrow_right', label: 'SIDEBAR.SUBCATEGORIES', route: '/admin/sub-categories' },
        { icon: 'branding_watermark', label: 'SIDEBAR.BRANDS', route: '/admin/brands' },
        { icon: 'inventory', label: 'SIDEBAR.PRODUCTS', route: '/admin/products' },
        { icon: 'shopping_cart', label: 'SIDEBAR.ORDERS', route: '/admin/orders' },
        { icon: 'people', label: 'SIDEBAR.USERS', route: '/admin/users' },
        { icon: 'settings', label: 'SIDEBAR.SETTINGS', route: '/admin/settings' }
    ];

    constructor(public authService: AuthService) { }

    get isAdmin(): boolean {
        return this.authService.isAdmin();
    }
}
