package com.mediahub.user.mapper;
import org.mapstruct.Mapper;

import com.mediahub.user.dto.UserDto;
import com.mediahub.user.model.User;

@Mapper(componentModel = "spring")   
public interface UserMapper {
    User dtoToEntity(UserDto dto);
    UserDto entityToDto(User user);
}
