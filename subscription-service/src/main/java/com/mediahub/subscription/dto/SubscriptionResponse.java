package com.mediahub.subscription.dto;

import com.mediahub.subscription.entity.Plan;
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
        LocalDateTime createdAt) {
}
