import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="login-page">
      <div class="login-card">
        <div class="brand">
          <span class="logo-text">MEDIA<span>HUB</span></span>
        </div>
        
        <h1>Welcome Back</h1>
        <p class="subtitle">Log in to your account to continue streaming.</p>

        @if (error()) {
          <div class="error-banner">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="username" 
              required 
              placeholder="Enter your username"
              [disabled]="isLoading()">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="password" 
              required 
              placeholder="Enter your password"
              [disabled]="isLoading()">
          </div>

          <button type="submit" class="login-btn" [disabled]="isLoading() || !loginForm.valid">
            {{ isLoading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="footer">
          <span>New to MediaHub?</span>
          <a routerLink="/register">Register now</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      padding: 1.5rem;
    }

    .login-card {
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(12px);
      padding: 3rem;
      border-radius: 1.5rem;
      width: 100%;
      max-width: 480px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .brand {
      margin-bottom: 2.5rem;
      text-align: center;
    }

    .logo-text {
      font-size: 2rem;
      font-weight: 800;
      color: white;
      letter-spacing: -0.025em;
    }

    .logo-text span {
      background: linear-gradient(to right, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    h1 {
      color: white;
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .subtitle {
      color: #94a3b8;
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      color: #e2e8f0;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid #334155;
      border-radius: 0.75rem;
      color: white;
      transition: all 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .login-btn {
      width: 100%;
      padding: 0.875rem;
      background: linear-gradient(to right, #6366f1, #a855f7);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 1rem;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
    }

    .login-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      padding: 1rem;
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      text-align: center;
    }

    .footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .footer a {
      color: #818cf8;
      text-decoration: none;
      font-weight: 600;
      margin-left: 0.5rem;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    username = '';
    password = '';
    isLoading = signal(false);
    error = signal<string | null>(null);

    onSubmit(): void {
        if (!this.username || !this.password) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.authService.login({ username: this.username, password: this.password })
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: () => this.router.navigate(['/subscriptions']),
                error: (err: any) => {
                    this.error.set('Invalid username or password. Please try again.');
                }
            });
    }
}
