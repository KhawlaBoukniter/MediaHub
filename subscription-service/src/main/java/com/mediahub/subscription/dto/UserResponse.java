package com.mediahub.subscription.dto;

public record UserResponse(
        Long id,
        String username,
        String email,
        String role
) {
}
