import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserAdminService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8081/api/users';

    /**
     * Fetch all users (Admin only).
     */
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl);
    }

    /**
     * Fetch a user by ID.
     */
    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${id}`);
    }

    /**
     * Update a user's details or role.
     */
    updateUser(id: number, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/${id}`, user);
    }

    /**
     * Delete a user.
     */
    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
