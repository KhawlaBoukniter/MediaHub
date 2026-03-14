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
    getHistory(userId: number): Observable<ViewingHistory[]> {
        return this.http.get<ViewingHistory[]>(`${this.baseUrl}/${userId}/history`).pipe(
            switchMap(historyItems => {
                if (historyItems.length === 0) return of([]);

                // Extract unique media IDs and fetch their details
                const mediaIds = [...new Set(historyItems.map(item => item.mediaId))];
                const mediaRequests = mediaIds.map(id => this.mediaService.getMediaById(id));

                return forkJoin(mediaRequests).pipe(
                    map(mediaList => {
                        const mediaMap = new Map(mediaList.map(m => [m.id, m]));
                        return historyItems.map(item => ({
                            ...item,
                            media: mediaMap.get(item.mediaId)
                        }));
                    })
                );
            })
        );
    }

    /**
     * Add a media item to the user's viewing history.
     */
    addToHistory(userId: number, mediaId: number): Observable<ViewingHistory> {
        return this.http.post<ViewingHistory>(`${this.baseUrl}/${userId}/history`, { mediaId });
    }
}
