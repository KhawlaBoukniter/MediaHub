package com.mediahub.user.controller;

import com.mediahub.user.dto.AuthResponse;
import com.mediahub.user.dto.LoginRequest;
import com.mediahub.user.dto.UserDto;
import com.mediahub.user.dto.ViewingHistoryResponse;
import com.mediahub.user.service.UserService;
import com.mediahub.user.service.ViewingHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ViewingHistoryService viewingHistoryService;
    private final com.mediahub.user.client.MediaClient mediaClient;
    private final com.mediahub.user.client.SubscriptionClient subscriptionClient;

    @GetMapping("/enriched/{userId}")
    public ResponseEntity<List<Object>> getEnrichedHistory(@PathVariable Long userId) {
        List<ViewingHistoryResponse> history = viewingHistoryService.findByUserId(userId);
        return ResponseEntity.ok(history.stream().map(h -> {
            // Simple approach: combine into a Map or DTO
            Map<String, Object> map = new HashMap<>();
            map.put("id", h.id());
            map.put("userId", h.userId());
            map.put("mediaId", h.mediaId());
            map.put("watchedAt", h.watchedAt());
            try {
                map.put("media", mediaClient.getMediaById(h.mediaId()));
            } catch (Exception e) {
                map.put("media", null);
            }
            return (Object) map;
        }).toList());
    }

    @GetMapping("/{id}/subscription")
    public ResponseEntity<Object> getUserSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionClient.getSubscriptionByUserId(id));
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@Valid @RequestBody UserDto request) {
        UserDto response = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id,
            @Valid @RequestBody UserDto request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

}
