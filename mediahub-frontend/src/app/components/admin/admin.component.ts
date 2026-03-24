import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <!-- Admin Sidebar/Nav -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <div class="admin-badge">ADMIN</div>
          <h3>Control Panel</h3>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/media" routerLinkActive="active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
            Media Library
          </a>
          <a routerLink="/admin/users" routerLinkActive="active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            User Accounts
          </a>
          <a routerLink="/admin/subscriptions" routerLinkActive="active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            Subscriptions
          </a>
        </nav>
      </aside>

      <!-- Sub-route Content -->
      <main class="admin-main animate-fade-in">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: calc(100vh - var(--nav-height)); background: var(--primary-dark); }
    .admin-sidebar { 
      width: 300px; 
      background: rgba(30, 41, 59, 0.3); 
      backdrop-filter: blur(10px);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      padding: 3rem 0;
    }
    .sidebar-header { padding: 0 2rem 2.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 2rem; }
    .admin-badge { 
      display: inline-block; padding: 0.25rem 0.5rem; background: var(--accent-indigo); 
      color: white; font-size: 0.7rem; font-weight: 900; border-radius: 4px; margin-bottom: 0.75rem;
    }
    .sidebar-header h3 { font-size: 1.5rem; font-weight: 800; color: white; letter-spacing: -0.05em; }
    .sidebar-nav { display: flex; flex-direction: column; gap: 0.75rem; padding: 0 1.5rem; }
    .sidebar-nav a { 
      display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; 
      text-decoration: none; color: var(--text-muted); font-weight: 600; border-radius: 1rem;
      transition: all 0.2s;
    }
    .nav-icon { width: 20px; height: 20px; opacity: 0.7; pointer-events: none; }
    .sidebar-nav a:hover { color: white; background: rgba(255, 255, 255, 0.05); }
    .sidebar-nav a.active { color: white; background: rgba(99, 102, 241, 0.15); box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.2); }
    .sidebar-nav a.active .nav-icon { color: var(--accent-indigo); opacity: 1; }
    .admin-main { flex: 1; overflow-y: auto; padding-bottom: 5rem; }
  `]
})
export class AdminComponent { }
