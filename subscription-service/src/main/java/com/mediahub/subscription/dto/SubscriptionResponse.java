package com.mediahub.subscription.dto;

import com.mediahub.subscription.entity.Plan;
import com.mediahub.subscription.entity.Subscription;
import com.mediahub.subscription.entity.SubscriptionStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SubscriptionResponse(
        Long id,
        Long userId,
        Plan plan,
        SubscriptionStatus status,
        LocalDate startDate,
        LocalDate endDate,
        LocalDateTime createdAt
) {
    public static SubscriptionResponse from(Subscription subscription) {
        return new SubscriptionResponse(
                subscription.getId(),
                subscription.getUserId(),
                subscription.getPlan(),
                subscription.getStatus(),
                subscription.getStartDate(),
                subscription.getEndDate(),
                subscription.getCreatedAt()
        );
    }
}
