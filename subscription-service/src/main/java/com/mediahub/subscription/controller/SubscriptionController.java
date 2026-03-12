package com.mediahub.subscription.controller;

import com.mediahub.subscription.dto.MediaResponse;
import com.mediahub.subscription.dto.SubscriptionRequest;
import com.mediahub.subscription.dto.SubscriptionResponse;
import com.mediahub.subscription.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>> findAll() {
        return ResponseEntity.ok(subscriptionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<SubscriptionResponse> create(@Valid @RequestBody SubscriptionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.create(request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<SubscriptionResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.cancel(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<SubscriptionResponse> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getByUserId(userId));
    }

    @GetMapping("/user/{userId}/status")
    public ResponseEntity<Map<String, Boolean>> isUserSubscribed(@PathVariable Long userId) {
        boolean subscribed = subscriptionService.isUserSubscribed(userId);
        return ResponseEntity.ok(Map.of("subscribed", subscribed));
    }

    @GetMapping("/user/{userId}/media")
    public ResponseEntity<List<MediaResponse>> getAvailableMedia(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getAvailableMedia(userId));
    }
}
