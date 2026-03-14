import { Component, OnInit, signal, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';
import { MediaService } from '../../services/media.service';
import { HistoryService } from '../../services/history.service';
import { ViewingHistory, Media } from '../../models/media.model';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="dashboard-container">
      <header class="welcome-header">
        <h1>Welcome back, {{ user()?.username }}!</h1>
        <p>Manage your account and continue your journey.</p>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon sub-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-info">
            <span class="label">Current Plan</span>
            <span class="value">{{ subscription()?.plan || 'No Active Plan' }}</span>
          </div>
          <a routerLink="/subscriptions" class="action-link">Manage</a>
        </div>

        <div class="stat-card">
          <div class="icon history-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-info">
            <span class="label">Recently Watched</span>
            <span class="value">{{ history().length }} Media</span>
          </div>
        </div>
      </div>

      <section class="resume-section">
        <h2>Continue Watching</h2>
        @if (isLoading()) {
          <div class="skeleton-grid">
            <div class="skeleton-card" *ngFor="let i of [1,2,3,4]"></div>
          </div>
        } @else if (history().length > 0) {
          <div class="history-grid">
             @for (item of history().slice(0, 4); track item.id) {
               <div class="history-card" [routerLink]="['/media', item.mediaId]">
                 <div class="poster">
                    <img [src]="item.media?.posterUrl || 'https://via.placeholder.com/200x300'" [alt]="item.media?.title">
                 </div>
                 <div class="info">
                    <h3>{{ item.media?.title || 'Unknown Media' }}</h3>
                    <span>Watched on {{ item.watchedAt | date }}</span>
                 </div>
               </div>
             }
          </div>
        } @else {
          <div class="empty-state">
            <p>You haven't watched anything yet.</p>
            <a routerLink="/catalog" class="cta">Browse Catalog</a>
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 3rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-header {
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 0.5rem;
    }

    p {
      color: #94a3b8;
      font-size: 1.125rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .stat-card {
      background: #1e293b;
      padding: 2rem;
      border-radius: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      position: relative;
      border: 1px solid #334155;
      transition: transform 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      border-color: #6366f1;
    }

    .icon {
      width: 56px;
      height: 56px;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sub-icon { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
    .history-icon { background: rgba(34, 197, 94, 0.1); color: #22c55e; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .value {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin-top: 0.25rem;
    }

    .action-link {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      font-size: 0.875rem;
      color: #818cf8;
      text-decoration: none;
      font-weight: 600;
    }

    .resume-section h2 {
      font-size: 1.5rem;
      color: white;
      margin-bottom: 2rem;
    }

    .history-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 2rem;
    }

    .history-card {
      background: #0f172a;
      border-radius: 1rem;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.3s;
    }

    .history-card:hover {
      border-color: #334155;
      transform: scale(1.02);
    }

    .poster {
      aspect-ratio: 16/9;
      overflow: hidden;
    }

    .poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .info {
      padding: 1rem;
    }

    .info h3 {
      font-size: 1rem;
      color: white;
      margin-bottom: 0.25rem;
    }

    .info span {
      font-size: 0.75rem;
      color: #64748b;
    }

    .empty-state {
      background: #1e293b;
      padding: 4rem;
      text-align: center;
      border-radius: 1.5rem;
      border: 2px dashed #334155;
    }

    .cta {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.75rem 2rem;
      background: #6366f1;
      color: white;
      border-radius: 2rem;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s;
    }

    .cta:hover {
      background: #4f46e5;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private subService = inject(SubscriptionService);
  private mediaService = inject(MediaService);
  private historyService = inject(HistoryService);

  user = this.authService.currentUser;
  subscription = signal<any>(null);
  history = signal<ViewingHistory[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const currentUser = this.user();
    if (!currentUser) return;

    this.isLoading.set(true);
    this.subService.getSubscriptionByUserId(currentUser.id)
      .subscribe({
        next: (sub) => this.subscription.set(sub),
        error: () => this.subscription.set(null)
      });

    this.historyService.getHistory(currentUser.id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (history) => this.history.set(history),
        error: () => this.history.set([])
      });
  }
}
