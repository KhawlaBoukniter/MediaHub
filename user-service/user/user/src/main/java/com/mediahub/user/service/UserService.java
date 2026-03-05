package com.mediahub.user.service;

import java.util.List;

import com.mediahub.user.dto.UserDto;

public interface UserService {
    UserDto CreeUser(UserDto dto);
    UserDto getUserById(Integer id);
    List<UserDto> getAllUsers();
    UserDto updateUser(Integer id, UserDto dto);
    void deleteUser(Integer id);
}
