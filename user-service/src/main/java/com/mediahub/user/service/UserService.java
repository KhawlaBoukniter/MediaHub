package com.mediahub.user.service;

import com.mediahub.user.dto.UserDto;

import java.util.List;

public interface UserService {

    List<UserDto> findAll();

    UserDto findById(Long id);

    UserDto create(UserDto request);

    UserDto update(Long id, UserDto request);

    void delete(Long id);

}
