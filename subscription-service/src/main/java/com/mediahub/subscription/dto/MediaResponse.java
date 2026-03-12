package com.mediahub.subscription.dto;

public record MediaResponse(
        Long id,
        String title,
        String description,
        String type,
        String genre,
        String category
) {
}
