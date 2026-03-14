import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MediaService } from '../../../services/media.service';
import { HistoryService } from '../../../services/history.service';
import { AuthService } from '../../../services/auth.service';
import { Media } from '../../../models/media.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-media-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="detail-container">
      @if (isLoading()) {
        <div class="loading">Loading details...</div>
      } @else if (media()) {
        <div class="backdrop" [style.backgroundImage]="'url(' + media()?.posterUrl + ')'"></div>
        
        <div class="content">
          <div class="main-info">
            <button class="back-btn" routerLink="/catalog">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Catalog
            </button>

            <div class="metadata">
              <span class="category">{{ media()?.category }}</span>
              <span class="genre">{{ media()?.genre }}</span>
            </div>
            
            <h1>{{ media()?.title }}</h1>
            <p class="description">{{ media()?.description }}</p>

            <div class="details">
                <div class="detail-item">
                    <span class="label">Duration</span>
                    <span class="value">{{ media()?.duration }} minutes</span>
                </div>
                <div class="detail-item">
                    <span class="label">Release Date</span>
                    <span class="value">{{ media()?.releaseDate | date }}</span>
                </div>
            </div>

            <button class="watch-btn" (click)="onWatch()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Watch Now
            </button>
          </div>

          <div class="poster-side">
             <img [src]="media()?.posterUrl" [alt]="media()?.title">
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-container {
      min-height: 100vh;
      position: relative;
      background: #0f172a;
      overflow-x: hidden;
    }

    .backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 60vh;
      background-size: cover;
      background-position: center;
      filter: blur(40px) brightness(0.4);
      opacity: 0.6;
      mask-image: linear-gradient(to bottom, black 50%, transparent);
    }

    .content {
      position: relative;
      z-index: 1;
      padding: 6rem 4rem;
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 6rem;
      align-items: center;
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 3rem;
      transition: all 0.2s;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .metadata {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .metadata span {
      padding: 0.4rem 1rem;
      background: #312e81;
      color: #818cf8;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    h1 {
      font-size: 4.5rem;
      font-weight: 900;
      color: white;
      line-height: 1;
      margin-bottom: 2rem;
      letter-spacing: -0.04em;
    }

    .description {
      font-size: 1.25rem;
      line-height: 1.6;
      color: #94a3b8;
      max-width: 800px;
      margin-bottom: 3rem;
    }

    .details {
        display: flex;
        gap: 4rem;
        margin-bottom: 4rem;
    }

    .detail-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .label {
        font-size: 0.875rem;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .value {
        font-size: 1.125rem;
        color: white;
        font-weight: 600;
    }

    .watch-btn {
      padding: 1.2rem 3rem;
      background: white;
      color: #0f172a;
      border: none;
      border-radius: 4rem;
      font-size: 1.25rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .watch-btn:hover {
      transform: scale(1.05) translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    .poster-side img {
      width: 100%;
      border-radius: 2rem;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .loading {
      color: white;
      text-align: center;
      padding: 10rem;
      font-size: 1.5rem;
    }
  `]
})
export class MediaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mediaService = inject(MediaService);
  private historyService = inject(HistoryService);
  private authService = inject(AuthService);

  media = signal<Media | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMedia(Number(id));
    }
  }

  loadMedia(id: number): void {
    this.isLoading.set(true);
    this.mediaService.getMediaById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data: Media) => this.media.set(data),
        error: () => alert('Failed to load media details.')
      });
  }

  onWatch(): void {
    const user = this.authService.currentUser();
    const media = this.media();
    if (user && media) {
      this.historyService.addToHistory(user.id, media.id).subscribe({
        next: () => alert(`🎬 Playing ${media.title}... (Watching history recorded!)`),
        error: () => alert('Failed to record viewing history, but enjoy the show!')
      });
    } else {
      alert('Please log in to watch and save your progress.');
    }
  }
}
