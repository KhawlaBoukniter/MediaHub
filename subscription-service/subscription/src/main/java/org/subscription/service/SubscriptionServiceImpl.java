package org.subscription.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.subscription.client.UserClient;
import org.subscription.model.Subscription;
import org.subscription.repository.SubscriptionRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl {
    private final SubscriptionRepository subscriptionRepository;
    private final UserClient userClient;

    @Transactional
    public Subscription createSubscription(Long userId) {

        userClient.getUserById(userId);

        List<Subscription> activeSubs = subscriptionRepository.findAll().stream()
            .filter(s -> s.getUserId().equals(userId) && "ACTIF".equals(s.getStatus()))
            .toList();
        
        if (!activeSubs.isEmpty()) {
            throw new RuntimeException("Cet utilisateur a déjà un abonnement actif");
        }

        Subscription sub = new Subscription();
        sub.setUserId(userId);
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusMonths(1));
        sub.setStatus("ACTIF");

        return subscriptionRepository.save(sub);
    }

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }
}
