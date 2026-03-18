import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../services/media.service';
import { Media } from '../../models/media.model';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="catalog-container">
      <header class="catalog-header">
        <h1>Discover Media</h1>
        <div class="search-bar">
          <input type="text" placeholder="Search movies, series..." (input)="onSearch($event)">
        </div>
      </header>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading your catalog...</p>
        </div>
      } @else if (error()) {
        <div class="error-state">
          <p>{{ error() }}</p>
          <button (click)="loadMedia()">Retry</button>
        </div>
      } @else {
        <div class="categories">
          @for (category of categories(); track category) {
            <section class="category-section">
              <h2>{{ category }}</h2>
              <div class="media-grid">
                @for (item of getMediaInCategory(category); track item.id) {
                  <div class="media-card" [routerLink]="['/media', item.id]">
                    <div class="poster-wrapper">
                      <img [src]="item.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'" [alt]="item.title">
                      <div class="overlay">
                        <button class="play-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                      </div>
                    </div>
                    <div class="media-info">
                      <h3>{{ item.title }}</h3>
                      <div class="meta">
                        <span>{{ item.genre }}</span>
                        <span>•</span>
                        <span>{{ item.duration }} min</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </section>
          }
        </div>
      }
    </div>
  `,
    styles: [`
    .catalog-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .catalog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
    }

    .search-bar input {
      padding: 0.75rem 1.5rem;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 2rem;
      color: white;
      width: 300px;
      transition: all 0.3s;
    }

    .search-bar input:focus {
      width: 400px;
      border-color: #6366f1;
      outline: none;
    }

    .category-section {
      margin-bottom: 4rem;
    }

    h2 {
      font-size: 1.5rem;
      color: #94a3b8;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 2rem;
    }

    .media-card {
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .media-card:hover {
      transform: scale(1.05);
    }

    .poster-wrapper {
      position: relative;
      aspect-ratio: 2/3;
      border-radius: 1rem;
      overflow: hidden;
      margin-bottom: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .media-card:hover .overlay {
      opacity: 1;
    }

    .play-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: white;
      border: none;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: scale(0.8);
      transition: transform 0.3s;
    }

    .media-card:hover .play-btn {
      transform: scale(1);
    }

    .media-info h3 {
      font-size: 1.1rem;
      color: white;
      margin-bottom: 0.25rem;
    }

    .meta {
      display: flex;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #64748b;
    }

    .loading-state, .error-state {
      text-align: center;
      padding: 5rem;
      color: #94a3b8;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(99, 102, 241, 0.1);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class CatalogComponent implements OnInit {
    private mediaService = inject(MediaService);

    allMedia = signal<Media[]>([]);
    categories = signal<string[]>([]);
    isLoading = signal(true);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.loadMedia();
    }

    loadMedia(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.mediaService.getAllMedia()
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (data) => {
                    this.allMedia.set(data);
                    this.extractCategories(data);
                },
                error: (err) => {
                    this.error.set('Failed to load media catalog. Please try again later.');
                }
            });
    }

    getMediaInCategory(category: string): Media[] {
        return this.allMedia().filter(m => m.category === category);
    }

    onSearch(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        // Implement local filtering for better UX
        if (!query) {
            this.loadMedia();
            return;
        }
        const filtered = this.allMedia().filter(m =>
            m.title.toLowerCase().includes(query.toLowerCase()) ||
            m.genre.toLowerCase().includes(query.toLowerCase())
        );
        this.allMedia.set(filtered);
        this.extractCategories(filtered);
    }

    private extractCategories(media: Media[]): void {
        const cats = Array.from(new Set(media.map(m => m.category)));
        this.categories.set(cats);
    }
}
