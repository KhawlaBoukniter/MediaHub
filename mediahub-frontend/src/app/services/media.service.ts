import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media } from '../models/media.model';

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8082/api/media';

    /**
     * Fetch all media items in the catalog.
     */
    getAllMedia(): Observable<Media[]> {
        return this.http.get<Media[]>(this.baseUrl);
    }

    /**
     * Fetch media by ID.
     */
    getMediaById(id: number): Observable<Media> {
        return this.http.get<Media>(`${this.baseUrl}/${id}`);
    }

    /**
     * Search media by category.
     */
    getMediaByCategory(category: string): Observable<Media[]> {
        return this.http.get<Media[]>(`${this.baseUrl}/category/${category}`);
    }

    /**
     * Search media by title.
     */
    searchMedia(query: string): Observable<Media[]> {
        return this.http.get<Media[]>(`${this.baseUrl}/search?title=${query}`);
    }

    /**
     * Create new media (Admin only).
     */
    createMedia(media: Partial<Media>): Observable<Media> {
        return this.http.post<Media>(this.baseUrl, media);
    }

    /**
     * Update existing media (Admin only).
     */
    updateMedia(id: number, media: Partial<Media>): Observable<Media> {
        return this.http.put<Media>(`${this.baseUrl}/${id}`, media);
    }

    /**
     * Delete media (Admin only).
     */
    deleteMedia(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
