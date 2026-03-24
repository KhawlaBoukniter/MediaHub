import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard to prevent access to admin routes if the user is not an admin.
 */
export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated() && authService.isAdmin()) {
        return true;
    }

    // Redirect to dashboard or login if not authorized
    if (authService.isAuthenticated()) {
        router.navigate(['/dashboard']);
    } else {
        router.navigate(['/login']);
    }
    return false;
};
