package com.mediahub.subscription.service;

import com.mediahub.subscription.client.MediaClient;
import com.mediahub.subscription.client.UserClient;
import com.mediahub.subscription.dto.MediaResponse;
import com.mediahub.subscription.dto.SubscriptionRequest;
import com.mediahub.subscription.dto.SubscriptionResponse;
import com.mediahub.subscription.entity.Subscription;
import com.mediahub.subscription.entity.SubscriptionStatus;
import com.mediahub.subscription.exception.DuplicateResourceException;
import com.mediahub.subscription.exception.ResourceNotFoundException;
import com.mediahub.subscription.exception.ServiceUnavailableException;
import com.mediahub.subscription.mapper.SubscriptionMapper;
import com.mediahub.subscription.repository.SubscriptionRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserClient userClient;
    private final MediaClient mediaClient;
    private final SubscriptionMapper subscriptionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionResponse> findAll() {
        return subscriptionRepository.findAll()
                .stream()
                .map(subscriptionMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionResponse findById(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
        return subscriptionMapper.toResponse(subscription);
    }

    @Override
    @Transactional
    public SubscriptionResponse create(SubscriptionRequest request) {
        try {
            userClient.getUserById(request.userId());
        } catch (FeignException e) {
            throw new ServiceUnavailableException(
                    "User service is unavailable or user not found with id: " + request.userId());
        }

        if (subscriptionRepository.existsByUserIdAndStatus(request.userId(), SubscriptionStatus.ACTIVE)) {
            throw new DuplicateResourceException("User already has an active subscription");
        }

        Subscription subscription = new Subscription();
        subscription.setUserId(request.userId());
        subscription.setPlan(request.plan());
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(30));

        Subscription saved = subscriptionRepository.save(subscription);
        return subscriptionMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionResponse getByUserId(Long userId) {
        Subscription subscription = subscriptionRepository.findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(
                        () -> new ResourceNotFoundException("No active subscription found for user id: " + userId));
        return subscriptionMapper.toResponse(subscription);
    }

    @Override
    public boolean isUserSubscribed(Long userId) {
        return subscriptionRepository.existsByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> getAvailableMedia(Long userId) {
        if (!isUserSubscribed(userId)) {
            throw new ResourceNotFoundException("No active subscription found for user id: " + userId);
        }
        return mediaClient.getAllMedia();
    }
}
