package com.mediahub.user.dto;

import jakarta.validation.constraints.NotNull;

public record ViewingHistoryRequest(
        @NotNull(message = "Media ID is required")
        Long mediaId
) {
}
