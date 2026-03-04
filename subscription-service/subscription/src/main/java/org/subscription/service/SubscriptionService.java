package org.subscription.service;

import org.subscription.model.Subscription;

import java.util.List;

public interface SubscriptionService {
    public Subscription createSubscription(Long userId);
    public List<Subscription> getAllSubscriptions();
}
