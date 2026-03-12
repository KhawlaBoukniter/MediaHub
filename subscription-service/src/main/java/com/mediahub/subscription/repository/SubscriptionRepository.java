package com.mediahub.subscription.repository;

import com.mediahub.subscription.entity.Subscription;
import com.mediahub.subscription.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);

    List<Subscription> findByUserId(Long userId);

    boolean existsByUserIdAndStatus(Long userId, SubscriptionStatus status);
}
