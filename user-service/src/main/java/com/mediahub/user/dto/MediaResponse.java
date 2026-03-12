package com.mediahub.user.dto;

import java.time.LocalDate;

public record MediaResponse(
        Long id,
        String title,
        String description,
        String type,
        String genre,
        String category,
        LocalDate releaseDate,
        Integer duration
) {
}
