package com.mediahub.user.dto;

import java.time.LocalDateTime;

public record ViewingHistoryResponse(
        Long id,
        Long userId,
        Long mediaId,
        LocalDateTime watchedAt) {
}
