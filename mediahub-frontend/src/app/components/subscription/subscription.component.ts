import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service';
import { Plan, SubscriptionResponse, SubscriptionStatus } from '../../models/subscription.model';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-subscription',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './subscription.component.html',
    styleUrl: './subscription.component.css'
})
export class SubscriptionComponent implements OnInit {
    private subscriptionService = inject(SubscriptionService);
    private authService = inject(AuthService);

    user = this.authService.currentUser;
    isAdmin = this.authService.isAdmin;

    plans = [
        {
            name: Plan.BASIC,
            price: '9.99',
            features: ['720p Resolution', '1 Device', 'Basic Catalog'],
            accent: '#3b82f6'
        },
        {
            name: Plan.STANDARD,
            price: '14.99',
            features: ['1080p Resolution', '2 Devices', 'Full Catalog', 'No Ads'],
            accent: '#8b5cf6'
        },
        {
            name: Plan.PREMIUM,
            price: '19.99',
            features: ['4K + HDR Resolution', '4 Devices', 'Full Catalog', 'Offline Downloads', 'Premium Support'],
            accent: '#ec4899'
        }
    ];

    currentSubscription = signal<SubscriptionResponse | null>(null);
    isLoading = signal<boolean>(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.loadCurrentSubscription();
    }

    loadCurrentSubscription(): void {
        const currentUser = this.user();
        if (!currentUser) return;

        this.isLoading.set(true);
        this.error.set(null);
        this.subscriptionService.getSubscriptionByUserId(currentUser.id)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (sub) => {
                    this.currentSubscription.set(sub);
                },
                error: (err) => {
                    if (err.status === 404 || err.status === 204) {
                        this.currentSubscription.set(null);
                    } else {
                        this.error.set('Failed to load subscription status.');
                    }
                }
            });
    }

    onSubscribe(plan: Plan): void {
        const currentUser = this.user();
        if (!currentUser) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.subscriptionService.subscribe({ userId: currentUser.id, plan })
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (sub) => {
                    this.currentSubscription.set(sub);
                    alert(`Successfully subscribed to ${plan}!`);
                },
                error: (err) => {
                    if (err.status === 409) {
                        this.error.set('You already have an active subscription.');
                    } else {
                        this.error.set(err.error?.message || 'Subscription failed.');
                    }
                }
            });
    }

    onCancel(): void {
        const currentUser = this.user();
        if (!currentUser || !confirm('Are you sure you want to cancel your plan?')) return;

        this.isLoading.set(true);
        this.subscriptionService.cancelSubscription(currentUser.id)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: () => {
                    alert('Cancelled successfully.');
                    this.loadCurrentSubscription();
                },
                error: () => alert('Failed to cancel.')
            });
    }

    isCurrentPlan(planName: Plan): boolean {
        return this.currentSubscription()?.plan === planName && this.currentSubscription()?.status === SubscriptionStatus.ACTIVE;
    }
}
