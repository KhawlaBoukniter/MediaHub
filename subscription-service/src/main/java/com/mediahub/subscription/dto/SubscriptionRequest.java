package com.mediahub.subscription.dto;

import com.mediahub.subscription.entity.Plan;
import jakarta.validation.constraints.NotNull;

public record SubscriptionRequest(
        @NotNull(message = "User ID is required")
        Long userId,

        @NotNull(message = "Plan is required")
        Plan plan
) {
}
