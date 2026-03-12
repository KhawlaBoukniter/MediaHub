package com.mediahub.user.controller;

import com.mediahub.user.dto.ViewingHistoryDetailResponse;
import com.mediahub.user.dto.ViewingHistoryRequest;
import com.mediahub.user.dto.ViewingHistoryResponse;
import com.mediahub.user.service.ViewingHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/history")
@RequiredArgsConstructor
public class ViewingHistoryController {

    private final ViewingHistoryService viewingHistoryService;

    @GetMapping
    public ResponseEntity<List<ViewingHistoryResponse>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(viewingHistoryService.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<ViewingHistoryResponse> addToHistory(@PathVariable Long userId,
                                                               @Valid @RequestBody ViewingHistoryRequest request) {
        ViewingHistoryResponse response = viewingHistoryService.addToHistory(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{historyId}/details")
    public ResponseEntity<ViewingHistoryDetailResponse> getHistoryWithMediaDetails(@PathVariable Long userId,
                                                                                   @PathVariable Long historyId) {
        return ResponseEntity.ok(viewingHistoryService.getHistoryWithMediaDetails(userId, historyId));
    }
}
