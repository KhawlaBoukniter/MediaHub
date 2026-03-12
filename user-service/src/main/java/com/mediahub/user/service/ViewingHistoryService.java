package com.mediahub.user.service;

import com.mediahub.user.dto.ViewingHistoryDetailResponse;
import com.mediahub.user.dto.ViewingHistoryRequest;
import com.mediahub.user.dto.ViewingHistoryResponse;

import java.util.List;

public interface ViewingHistoryService {

    List<ViewingHistoryResponse> findByUserId(Long userId);

    ViewingHistoryResponse addToHistory(Long userId, ViewingHistoryRequest request);

    ViewingHistoryDetailResponse getHistoryWithMediaDetails(Long userId, Long historyId);
}
