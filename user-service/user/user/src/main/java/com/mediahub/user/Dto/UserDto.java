package com.mediahub.user.Dto;

import javax.management.relation.Role;

public record UserDto(String username , String email , String password , Role role) {
} 