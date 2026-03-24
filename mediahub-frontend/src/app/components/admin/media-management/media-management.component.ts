import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaService } from '../../../services/media.service';
import { Media } from '../../../models/media.model';

@Component({
  selector: 'app-media-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container animate-fade-in">
      <header class="admin-header">
        <div>
          <h2>Media Library</h2>
          <p>Curate and manage your content catalog.</p>
        </div>
        <button (click)="toggleAddForm()" class="btn-primary">
          <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          {{ showAddForm ? 'Cancel' : 'New Content' }}
        </button>
      </header>

      <!-- Add/Edit Form -->
      @if (showAddForm || editingMedia) {
        <div class="admin-card animate-fade-in" style="margin-bottom: 4rem;">
          <h3 style="margin-bottom: 2.5rem; font-size: 1.75rem; letter-spacing: -0.02em;">{{ editingMedia ? 'Refine' : 'Add New' }} Media</h3>
          <form (ngSubmit)="saveMedia()" #mediaForm="ngForm">
            <div class="form-grid">
              <div class="form-group">
                <label>Title</label>
                <input type="text" [(ngModel)]="currentMedia.title" name="title" class="form-control" placeholder="e.g. Inception" required>
              </div>
              <div class="form-group">
                <label>Type</label>
                <select [(ngModel)]="currentMedia.type" name="type" class="form-control" required>
                    <option value="FILM">Film</option>
                    <option value="SERIES">Series</option>
                    <option value="PODCAST">Podcast</option>
                </select>
              </div>
              <div class="form-group">
                <label>Category</label>
                <input type="text" [(ngModel)]="currentMedia.category" name="category" class="form-control" placeholder="e.g. Movies" required>
              </div>
              <div class="form-group">
                <label>Genre</label>
                <select [(ngModel)]="currentMedia.genre" name="genre" class="form-control" required>
                    <option value="ACTION">Action</option>
                    <option value="COMEDY">Comedy</option>
                    <option value="DRAMA">Drama</option>
                    <option value="HORROR">Horror</option>
                    <option value="SCI_FI">Sci-Fi</option>
                    <option value="DOCUMENTARY">Documentary</option>
                </select>
              </div>
              <div class="form-group">
                <label>Poster URL</label>
                <input type="text" [(ngModel)]="currentMedia.posterUrl" name="posterUrl" class="form-control" placeholder="https://...">
              </div>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="currentMedia.description" name="description" rows="3" class="form-control" placeholder="Tell the story..."></textarea>
            </div>
            <div style="display: flex; gap: 2rem; margin-top: 3rem;">
              <button type="submit" [disabled]="!mediaForm.form.valid" class="btn-primary">Save Changes</button>
              <button type="button" (click)="cancelEdit()" class="btn-ghost">Discard Changes</button>
            </div>
          </form>
        </div>
      }

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Content</th>
              <th>Type</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of mediaList()">
              <td>
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                  <img [src]="m.posterUrl || 'https://via.placeholder.com/40x60'" style="width: 50px; height: 75px; border-radius: 0.75rem; object-fit: cover; background: #333; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                  <span style="font-weight: 700; font-size: 1.1rem;">{{ m.title }}</span>
                </div>
              </td>
              <td>
                <span class="badge badge-premium" style="font-size: 0.75rem; letter-spacing: 0.05em;">{{ m.type }}</span>
              </td>
              <td>
                 <span style="color: var(--text-muted); font-size: 1rem;">{{ m.category }}</span>
              </td>
              <td>
                <div style="display: flex; gap: 1.5rem;">
                  <button (click)="editMedia(m)" style="background:none; border:none; color: var(--accent-indigo); cursor:pointer; font-weight:700; font-size: 0.9rem;">Edit</button>
                  <button (click)="deleteMedia(m.id)" style="background:none; border:none; color: #ef4444; cursor:pointer; font-weight:700; font-size: 0.9rem;">Delete</button>
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
export class MediaManagementComponent implements OnInit {
  private mediaService = inject(MediaService);
  mediaList = signal<Media[]>([]);
  showAddForm = false;
  editingMedia: Media | null = null;
  currentMedia: Partial<Media> = { type: 'FILM' };

  ngOnInit() {
    this.loadMedia();
  }

  loadMedia() {
    this.mediaService.getAllMedia().subscribe(list => this.mediaList.set(list));
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.editingMedia = null;
      this.currentMedia = { type: 'FILM' };
    }
  }

  saveMedia() {
    if (this.editingMedia) {
      this.mediaService.updateMedia(this.editingMedia.id, this.currentMedia).subscribe(() => {
        this.loadMedia();
        this.cancelEdit();
      });
    } else {
      this.mediaService.createMedia(this.currentMedia).subscribe(() => {
        this.loadMedia();
        this.cancelEdit();
      });
    }
  }

  editMedia(media: Media) {
    this.editingMedia = media;
    this.currentMedia = { ...media };
    this.showAddForm = false;
  }

  deleteMedia(id: number) {
    if (confirm('Are you sure you want to delete this media?')) {
      this.mediaService.deleteMedia(id).subscribe(() => this.loadMedia());
    }
  }

  cancelEdit() {
    this.showAddForm = false;
    this.editingMedia = null;
    this.currentMedia = { type: 'FILM' };
  }
}
