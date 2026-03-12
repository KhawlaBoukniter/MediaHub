package com.mediahub.user.dto;

import com.mediahub.user.entity.ViewingHistory;

import java.time.LocalDateTime;

public record ViewingHistoryResponse(
        Long id,
        Long userId,
        Long mediaId,
        LocalDateTime watchedAt
) {
    public static ViewingHistoryResponse from(ViewingHistory history) {
        return new ViewingHistoryResponse(
                history.getId(),
                history.getUserId(),
                history.getMediaId(),
                history.getWatchedAt()
        );
    }
}
