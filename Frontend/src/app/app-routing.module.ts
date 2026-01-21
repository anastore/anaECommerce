import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './admin/users/user-list/user-list.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { ProductsComponent } from './admin/products/products.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { SubCategoriesComponent } from './admin/sub-categories/sub-categories.component';
import { BrandsComponent } from './admin/brands/brands.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Admin Routes
    { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
    { path: 'admin/users', component: UserListComponent, canActivate: [AdminGuard] },
    { path: 'admin/categories', component: CategoriesComponent, canActivate: [AdminGuard] },
    { path: 'admin/sub-categories', component: SubCategoriesComponent, canActivate: [AdminGuard] },
    { path: 'admin/brands', component: BrandsComponent, canActivate: [AdminGuard] },
    { path: 'admin/products', component: ProductsComponent, canActivate: [AdminGuard] },
    { path: 'admin/orders', component: OrdersComponent, canActivate: [AdminGuard] },
    { path: 'profile', component: ProfileComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
