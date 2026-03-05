package org.subscription.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.subscription.model.Subscription;
import org.subscription.service.SubscriptionServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionServiceImpl subscriptionService;

    @PostMapping
    public ResponseEntity<Subscription> create(@RequestParam Long userId, @RequestParam Long mediaId) {
        return new ResponseEntity<>(subscriptionService.createSubscription(userId, mediaId), HttpStatus.CREATED);
    }

    @GetMapping
    public List<Subscription> getAll() {
        return subscriptionService.getAllSubscriptions();
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<String> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionDetails(id));
    }
}
