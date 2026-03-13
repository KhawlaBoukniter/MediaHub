package com.mediahub.media.dto;

import com.mediahub.media.entity.Genre;
import com.mediahub.media.entity.MediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MediaRequest(
                @NotBlank(message = "Title is required") String title,

                String description,

                @NotNull(message = "Media type is required") MediaType type,

                @NotNull(message = "Genre is required") Genre genre,

                @NotBlank(message = "Category is required") String category) {
}
