package com.mediahub.subscription.service;

import com.mediahub.subscription.dto.MediaResponse;
import com.mediahub.subscription.dto.SubscriptionRequest;
import com.mediahub.subscription.dto.SubscriptionResponse;

import java.util.List;

public interface SubscriptionService {

    List<SubscriptionResponse> findAll();

    SubscriptionResponse findById(Long id);

    SubscriptionResponse create(SubscriptionRequest request);

    SubscriptionResponse getByUserId(Long userId);

    boolean isUserSubscribed(Long userId);

    List<MediaResponse> getAvailableMedia(Long userId);
}
