import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAdminService } from '../../../services/user-admin.service';
import { User, Role } from '../../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container animate-fade-in">
      <header class="admin-header">
        <div>
          <h2>User Accounts</h2>
          <p>Overarching control of platform access and permissions.</p>
        </div>
      </header>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th style="padding-left: 3rem;">Contact</th>
              <th>Access Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users()">
              <td>
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                  <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--accent-indigo); border: 1px solid rgba(255,255,255,0.1); font-size: 1.2rem;">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <span style="font-weight: 700; font-size: 1.1rem;">{{ user.username }}</span>
                </div>
              </td>
              <td style="padding-left: 3rem;">
                <span style="color: var(--text-muted); font-size: 0.95rem;">{{ user.email }}</span>
              </td>
              <td>
                <span class="badge" [class.badge-admin]="user.role === 'ADMIN'" [class.badge-user]="user.role !== 'ADMIN'">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 2rem;">
                  <button (click)="toggleRole(user)" class="btn-primary" [title]="user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'">
                    {{ user.role === 'ADMIN' ? 'Demote' : 'Promote' }}
                  </button>
                  <button (click)="deleteUser(user.id)" class="btn-danger">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserAdminService);
  users = signal<User[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => this.users.set(users));
  }

  toggleRole(user: User) {
    const updatedUser: User = {
      ...user,
      role: user.role === Role.ADMIN ? Role.USER : Role.ADMIN
    };
    this.userService.updateUser(user.id, updatedUser).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to update user role:', err)
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
