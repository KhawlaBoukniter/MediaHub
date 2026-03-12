package com.mediahub.user.service;

import com.mediahub.user.dto.MediaResponse;
import com.mediahub.user.dto.ViewingHistoryDetailResponse;
import com.mediahub.user.dto.ViewingHistoryRequest;
import com.mediahub.user.dto.ViewingHistoryResponse;
import com.mediahub.user.entity.ViewingHistory;
import com.mediahub.user.exception.ResourceNotFoundException;
import com.mediahub.user.repository.UserRepository;
import com.mediahub.user.repository.ViewingHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ViewingHistoryServiceImpl implements ViewingHistoryService {

    private final ViewingHistoryRepository viewingHistoryRepository;
    private final UserRepository userRepository;
    private final WebClient.Builder webClientBuilder;

    @Override
    @Transactional(readOnly = true)
    public List<ViewingHistoryResponse> findByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return viewingHistoryRepository.findByUserIdOrderByWatchedAtDesc(userId)
                .stream()
                .map(ViewingHistoryResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public ViewingHistoryResponse addToHistory(Long userId, ViewingHistoryRequest request) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        ViewingHistory history = ViewingHistory.builder()
                .userId(userId)
                .mediaId(request.mediaId())
                .build();

        ViewingHistory savedHistory = viewingHistoryRepository.save(history);
        return ViewingHistoryResponse.from(savedHistory);
    }

    @Override
    @Transactional(readOnly = true)
    public ViewingHistoryDetailResponse getHistoryWithMediaDetails(Long userId, Long historyId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        ViewingHistory history = viewingHistoryRepository.findById(historyId)
                .orElseThrow(() -> new ResourceNotFoundException("Viewing history not found with id: " + historyId));

        if (!history.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Viewing history entry does not belong to user: " + userId);
        }

        MediaResponse mediaResponse = webClientBuilder.build()
                .get()
                .uri("http://media-service/api/media/{mediaId}", history.getMediaId())
                .retrieve()
                .bodyToMono(MediaResponse.class)
                .block();

        log.info("Fetched media details for mediaId={} via WebClient", history.getMediaId());

        return ViewingHistoryDetailResponse.of(history, mediaResponse);
    }
}
