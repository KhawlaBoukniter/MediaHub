package org.subscription.service;

import org.subscription.model.Subscription;

import java.util.List;

public interface SubscriptionService {
    public Subscription createSubscription(Long userId, Long mediaId);
    public List<Subscription> getAllSubscriptions();
    public String getSubscriptionDetails(Long id);
}
