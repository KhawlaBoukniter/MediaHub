package com.mediahub.user.Mapper;
import org.mapstruct.Mapper;

import com.mediahub.user.Dto.UserDto;
import com.mediahub.user.Model.User;

@Mapper(componentModel = "spring")   
public interface UserMapper {
    User dtoToEntity(UserDto dto);
    UserDto entityToDto(User user);
}
