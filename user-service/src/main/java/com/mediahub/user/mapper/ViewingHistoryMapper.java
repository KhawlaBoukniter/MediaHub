package com.mediahub.user.mapper;

import com.mediahub.user.dto.ViewingHistoryResponse;
import com.mediahub.user.entity.ViewingHistory;
import org.springframework.stereotype.Component;

@Component
public class ViewingHistoryMapper {

    public ViewingHistoryResponse toResponse(ViewingHistory history) {
        if (history == null)
            return null;
        return new ViewingHistoryResponse(
                history.getId(),
                history.getUserId(),
                history.getMediaId(),
                history.getWatchedAt());
    }
}
