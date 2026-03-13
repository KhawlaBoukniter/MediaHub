package com.mediahub.subscription.dto;

public record UserDto(
        Long id,
        String username,
        String email,
        String password,
        String role) {
}
