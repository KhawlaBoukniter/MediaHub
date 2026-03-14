import { Routes } from '@angular/router';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { MediaDetailComponent } from './components/catalog/media-detail/media-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './services/auth.guard';

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
    { path: '', redirectTo: 'catalog', pathMatch: 'full' }
];
