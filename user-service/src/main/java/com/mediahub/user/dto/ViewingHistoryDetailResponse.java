package com.mediahub.user.dto;

import com.mediahub.user.entity.ViewingHistory;

import java.time.LocalDateTime;

public record ViewingHistoryDetailResponse(
        Long id,
        Long userId,
        Long mediaId,
        LocalDateTime watchedAt,
        MediaResponse media
) {
    public static ViewingHistoryDetailResponse of(ViewingHistory history, MediaResponse media) {
        return new ViewingHistoryDetailResponse(
                history.getId(),
                history.getUserId(),
                history.getMediaId(),
                history.getWatchedAt(),
                media
        );
    }
}
