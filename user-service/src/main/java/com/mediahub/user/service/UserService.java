package com.mediahub.user.service;

import com.mediahub.user.dto.SubscriptionResponse;
import com.mediahub.user.dto.UserRequest;
import com.mediahub.user.dto.UserResponse;

import java.util.List;

public interface UserService {

    List<UserResponse> findAll();

    UserResponse findById(Long id);

    UserResponse create(UserRequest request);

    UserResponse update(Long id, UserRequest request);

    void delete(Long id);

    SubscriptionResponse getUserSubscription(Long userId);
}
