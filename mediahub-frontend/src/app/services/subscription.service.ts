import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionRequest, SubscriptionResponse, SubscriptionStatus } from '../models/subscription.model';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8083/api/subscriptions';

    getSubscriptions(): Observable<SubscriptionResponse[]> {
        return this.http.get<SubscriptionResponse[]>(this.apiUrl);
    }

    getSubscriptionByUserId(userId: number): Observable<SubscriptionResponse> {
        return this.http.get<SubscriptionResponse>(`${this.apiUrl}/user/${userId}`);
    }

    subscribe(request: SubscriptionRequest): Observable<SubscriptionResponse> {
        return this.http.post<SubscriptionResponse>(this.apiUrl, request);
    }

    updateStatus(id: number, status: SubscriptionStatus): Observable<SubscriptionResponse> {
        return this.http.put<SubscriptionResponse>(`${this.apiUrl}/${id}/status`, null, {
            params: { status }
        });
    }

    cancelSubscription(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/user/${userId}`);
    }
}
