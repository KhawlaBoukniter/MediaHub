import { Routes } from '@angular/router';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { MediaDetailComponent } from './components/catalog/media-detail/media-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './services/auth.guard';
import { adminGuard } from './services/admin.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'catalog',
        component: CatalogComponent,
        canActivate: [authGuard]
    },
    {
        path: 'media/:id',
        component: MediaDetailComponent,
        canActivate: [authGuard]
    },
    {
        path: 'subscriptions',
        component: SubscriptionComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
        children: [
            {
                path: 'users',
                loadComponent: () => import('./components/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
            },
            {
                path: 'media',
                loadComponent: () => import('./components/admin/media-management/media-management.component').then(m => m.MediaManagementComponent)
            },
            {
                path: 'subscriptions',
                loadComponent: () => import('./components/admin/subscription-management/subscription-management.component').then(m => m.SubscriptionManagementComponent)
            },
            { path: '', redirectTo: 'media', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: 'catalog', pathMatch: 'full' }
];
