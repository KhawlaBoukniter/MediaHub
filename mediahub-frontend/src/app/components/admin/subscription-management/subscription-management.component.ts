import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../services/subscription.service';
import { SubscriptionResponse } from '../../../models/subscription.model';

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container animate-fade-in">
      <header class="admin-header">
        <div>
          <h2>Active Subscriptions</h2>
          <p>Real-time overview of user engagement and platform revenue.</p>
        </div>
      </header>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Plan Tier</th>
              <th>Period</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of subscriptions()">
              <td>
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                   <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(168, 85, 247, 0.1); color: #a855f7; display: flex; align-items: center; justify-content: center;">
                      <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                   </div>
                   <span style="font-family: monospace; font-weight: 700; color: var(--text-white); font-size: 1rem;">#USR-{{ s.userId }}</span>
                </div>
              </td>
              <td>
                <span class="badge" [class.badge-premium]="s.plan === 'PREMIUM'" [class.badge-user]="s.plan !== 'PREMIUM'">
                  {{ s.plan }}
                </span>
              </td>
              <td>
                <div style="font-size: 0.85rem; line-height: 1.4;">
                  <span style="color: var(--text-muted); margin-right: 0.5rem;">Ends:</span> <span style="color: white; font-weight: 600;">{{ s.endDate | date:'mediumDate' }}</span>
                </div>
              </td>
              <td>
                <span class="badge" style="background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2);">ACTIVE</span>
              </td>
            </tr>
            @if (subscriptions().length === 0) {
              <tr>
                <td colspan="4" style="text-align: center; padding: 4rem; color: var(--text-muted);">
                   No active subscriptions found.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class SubscriptionManagementComponent implements OnInit {
  private subService = inject(SubscriptionService);
  subscriptions = signal<SubscriptionResponse[]>([]);

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.subService.getSubscriptions().subscribe(list => this.subscriptions.set(list));
  }
}
