package com.mediahub.user.dto;

import com.mediahub.user.enums.Role;
public record UserDto(String username , String email , String password , Role role) {
} 