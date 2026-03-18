package com.mediahub.user.dto;

import com.mediahub.user.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserDto(
        Long id,

        @NotBlank(message = "Username is required") 
        String username,

        @NotBlank(message = "Email is required") 
        @Email(message = "Email must be valid") 
        String email,

        @NotBlank(message = "Password is required") 
        @Size(min = 6, message = "Password must be at least 6 characters") 
        String password,

        Role role
    ) {
}
