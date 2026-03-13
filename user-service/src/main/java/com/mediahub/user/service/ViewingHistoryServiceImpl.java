package com.mediahub.user.service;

import com.mediahub.user.dto.ViewingHistoryRequest;
import com.mediahub.user.dto.ViewingHistoryResponse;
import com.mediahub.user.entity.ViewingHistory;
import com.mediahub.user.exception.ResourceNotFoundException;
import com.mediahub.user.mapper.ViewingHistoryMapper;
import com.mediahub.user.repository.UserRepository;
import com.mediahub.user.repository.ViewingHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ViewingHistoryServiceImpl implements ViewingHistoryService {

    private final ViewingHistoryRepository viewingHistoryRepository;
    private final UserRepository userRepository;
    private final ViewingHistoryMapper viewingHistoryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ViewingHistoryResponse> findByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return viewingHistoryRepository.findByUserIdOrderByWatchedAtDesc(userId)
                .stream()
                .map(viewingHistoryMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ViewingHistoryResponse addToHistory(Long userId, ViewingHistoryRequest request) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        ViewingHistory history = new ViewingHistory();
        history.setUserId(userId);
        history.setMediaId(request.mediaId());

        ViewingHistory savedHistory = viewingHistoryRepository.save(history);
        return viewingHistoryMapper.toResponse(savedHistory);
    }

}
