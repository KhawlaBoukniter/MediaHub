package com.mediahub.media.dto;

import com.mediahub.media.entity.Genre;
import com.mediahub.media.entity.Media;
import com.mediahub.media.entity.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MediaResponse(
        Long id,
        String title,
        String description,
        MediaType type,
        Genre genre,
        String category,
        LocalDate releaseDate,
        Integer duration,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static MediaResponse from(Media media) {
        return new MediaResponse(
                media.getId(),
                media.getTitle(),
                media.getDescription(),
                media.getType(),
                media.getGenre(),
                media.getCategory(),
                media.getReleaseDate(),
                media.getDuration(),
                media.getCreatedAt(),
                media.getUpdatedAt()
        );
    }
}
