import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="login-page">
      <div class="login-card">
        <div class="brand">
          <span class="logo-text">MEDIA<span>HUB</span></span>
        </div>
        
        <h1>Create Account</h1>
        <p class="subtitle">Join MediaHub and start your streaming journey.</p>

        @if (error()) {
          <div class="error-banner">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="username" 
              required 
              minlength="3"
              placeholder="e.g. johndoe"
              [disabled]="isLoading()">
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="email" 
              required 
              email
              placeholder="e.g. john@example.com"
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
              minlength="6"
              placeholder="Min. 6 characters"
              [disabled]="isLoading()">
          </div>

          <button type="submit" class="login-btn" [disabled]="isLoading() || !registerForm.valid">
            {{ isLoading() ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <div class="footer">
          <span>Already have an account?</span>
          <a routerLink="/login">Sign In</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    /* Same styles as Login for consistency */
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
      color: #fca5a5;
      padding: 1rem;
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
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
  `]
})
export class RegisterComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    username = '';
    email = '';
    password = '';
    isLoading = signal(false);
    error = signal<string | null>(null);

    onSubmit(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.authService.register({
            username: this.username,
            email: this.email,
            password: this.password
        })
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: () => {
                    alert('Registration successful! Please log in.');
                    this.router.navigate(['/login']);
                },
                error: (err: any) => {
                    this.error.set(err.error?.message || 'Registration failed. Please try again.');
                }
            });
    }
}
