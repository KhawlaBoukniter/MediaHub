package com.mediahub.user.dto;

public record AuthResponse(
        String token,
        UserDto user) {
}
