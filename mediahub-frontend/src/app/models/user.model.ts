/**
 * Represent the User role in the system.
 */
export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

/**
 * Model representing a User in the system.
 */
export interface User {
    id: number;
    username: string;
    email: string;
    role: Role;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Request object for registration.
 */
export interface RegisterRequest {
    username: string;
    email: string;
    password: String;
}

/**
 * Request object for login.
 */
export interface LoginRequest {
    username: string;
    password: String;
}

/**
 * Response object for successful authentication.
 */
export interface AuthResponse {
    token: string;
    user: User;
}
