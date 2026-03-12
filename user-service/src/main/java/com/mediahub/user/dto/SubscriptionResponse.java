package com.mediahub.user.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SubscriptionResponse(
        Long id,
        Long userId,
        String plan,
        String status,
        LocalDate startDate,
        LocalDate endDate,
        LocalDateTime createdAt
) {
}
