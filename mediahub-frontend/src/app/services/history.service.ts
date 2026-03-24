import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin, of } from 'rxjs';
import { ViewingHistory, Media } from '../models/media.model';
import { MediaService } from './media.service';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {
    private http = inject(HttpClient);
    private mediaService = inject(MediaService);
    private readonly baseUrl = 'http://localhost:8081/api/users';

    /**
     * Get viewing history for a specific user, enriched with media details.
     */
    getHistory(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/enriched/${userId}`);
    }

    /**
     * Add a media item to the user's viewing history.
     */
    addToHistory(userId: number, mediaId: number): Observable<ViewingHistory> {
        return this.http.post<ViewingHistory>(`${this.baseUrl}/${userId}/history`, { mediaId });
    }
}
