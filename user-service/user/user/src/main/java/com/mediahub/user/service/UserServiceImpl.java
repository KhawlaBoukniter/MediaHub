package com.mediahub.user.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mediahub.user.dto.UserDto;
import com.mediahub.user.mapper.UserMapper;
import com.mediahub.user.model.User;
import com.mediahub.user.repository.UserRepository;
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserDto CreeUser(UserDto dto) {
        User user = userMapper.dtoToEntity(dto);
        Optional<User> exisisteUser = userRepository.findByEmail(dto.email());

        if (exisisteUser.isPresent()) {
            throw new RuntimeException("user already exists");
        }

        userRepository.save(user);
        return userMapper.entityToDto(user);
    }

    @Override
    public UserDto getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.entityToDto(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::entityToDto)
                .toList();
    }

    @Override
    public UserDto updateUser(Integer id, UserDto dto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setUsername(dto.username() != null ? dto.username() : existingUser.getUsername());
        existingUser.setEmail(dto.email() != null ? dto.email() : existingUser.getEmail());
        existingUser.setPassword(dto.password() != null ? dto.password() : existingUser.getPassword());
        existingUser.setRole(dto.role() != null ? dto.role() : existingUser.getRole());

        User updatedUser = userRepository.save(existingUser);

        return userMapper.entityToDto(updatedUser);
    }

    @Override
    public void deleteUser(Integer id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);
    }
}
