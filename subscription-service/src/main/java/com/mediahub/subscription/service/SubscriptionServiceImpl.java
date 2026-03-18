package com.mediahub.subscription.service;

import com.mediahub.subscription.client.MediaClient;
import com.mediahub.subscription.client.UserClient;
import com.mediahub.subscription.dto.MediaResponse;
import com.mediahub.subscription.dto.SubscriptionRequest;
import com.mediahub.subscription.dto.SubscriptionResponse;
import com.mediahub.subscription.entity.Plan;
import com.mediahub.subscription.entity.Subscription;
import com.mediahub.subscription.entity.SubscriptionStatus;
import com.mediahub.subscription.exception.ResourceNotFoundException;
import com.mediahub.subscription.exception.ServiceUnavailableException;
import com.mediahub.subscription.mapper.SubscriptionMapper;
import com.mediahub.subscription.repository.SubscriptionRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    private boolean isCurrentAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

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
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("User not found with id: " + request.userId());
        } catch (FeignException e) {
            throw new ServiceUnavailableException("User service is currently unavailable.");
        }

        Subscription subscription = subscriptionRepository
                .findByUserIdAndStatus(request.userId(), SubscriptionStatus.ACTIVE)
                .orElse(null);

        if (subscription == null) {
            subscription = new Subscription();
            subscription.setUserId(request.userId());
            subscription.setStatus(SubscriptionStatus.ACTIVE);
            subscription.setStartDate(LocalDate.now());
            subscription.setEndDate(LocalDate.now().plusDays(30));
        }

        subscription.setPlan(request.plan());
        Subscription saved = subscriptionRepository.save(subscription);
        return subscriptionMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionResponse getByUserId(Long userId) {
        return subscriptionRepository.findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .map(subscriptionMapper::toResponse)
                .orElseGet(() -> {
                    if (isCurrentAdmin()) {
                        return new SubscriptionResponse(
                                0L, userId, Plan.PREMIUM, SubscriptionStatus.ACTIVE,
                                LocalDate.now(), LocalDate.now().plusYears(100),
                                java.time.LocalDateTime.now());
                    }
                    throw new ResourceNotFoundException("No active subscription found for user id: " + userId);
                });
    }

    @Override
    public boolean isUserSubscribed(Long userId) {
        return isCurrentAdmin() || subscriptionRepository.existsByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> getAvailableMedia(Long userId) {
        if (!isUserSubscribed(userId)) {
            throw new ResourceNotFoundException("No active subscription found for user id: " + userId);
        }
        return mediaClient.getAllMedia();
    }

    @Override
    @Transactional
    public void cancelSubscription(Long userId) {
        Subscription subscription = subscriptionRepository.findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(
                        () -> new ResourceNotFoundException("No active subscription found for user id: " + userId));

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscriptionRepository.save(subscription);
    }
}
