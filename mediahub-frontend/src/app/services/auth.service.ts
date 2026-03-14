import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly baseUrl = 'http://localhost:8081/api/users'; // For now, we point to user-service
    private readonly tokenKey = 'mh_auth_token';
    private readonly userKey = 'mh_auth_user';

    // State
    private currentUserSignal = signal<User | null>(this.loadUser());

    // Public selectors
    currentUser = computed(() => this.currentUserSignal());
    isAuthenticated = computed(() => !!this.currentUserSignal());
    isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');

    constructor() {
        // Basic verification of token validity could go here
    }

    /**
     * Register a new user.
     */
    register(request: RegisterRequest): Observable<User> {
        return this.http.post<User>(this.baseUrl, request);
    }

    /**
     * Log in a user.
     * Note: This will be updated once JWT is implemented on the backend.
     * For now, it simulates a login by fetching the user by username/id (assuming username is used as ID or something simple for dev).
     */
    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
            tap(authResponse => this.setSession(authResponse))
        );
    }

    /**
     * Log out the user.
     */
    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSignal.set(null);
        this.router.navigate(['/login']);
    }

    /**
     * Get the current JWT token.
     */
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    private setSession(authResponse: AuthResponse): void {
        localStorage.setItem(this.tokenKey, authResponse.token);
        localStorage.setItem(this.userKey, JSON.stringify(authResponse.user));
        this.currentUserSignal.set(authResponse.user);
    }

    private loadUser(): User | null {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }
}
