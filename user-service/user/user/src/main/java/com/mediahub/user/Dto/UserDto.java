package com.mediahub.user.Dto;

import com.mediahub.user.Enums.Role;
public record UserDto(String username , String email , String password , Role role) {
} 