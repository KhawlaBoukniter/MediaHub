package com.mediahub.media.dto;

import com.mediahub.media.entity.Genre;
import com.mediahub.media.entity.MediaType;

import java.time.LocalDateTime;

public record MediaResponse(
        Long id,
        String title,
        String description,
        MediaType type,
        Genre genre,
        String category,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
