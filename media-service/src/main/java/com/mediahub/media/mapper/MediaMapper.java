package com.mediahub.media.mapper;

import com.mediahub.media.dto.MediaRequest;
import com.mediahub.media.dto.MediaResponse;
import com.mediahub.media.entity.Media;
import org.springframework.stereotype.Component;

@Component
public class MediaMapper {

    public MediaResponse toResponse(Media media) {
        if (media == null)
            return null;
        return new MediaResponse(
                media.getId(),
                media.getTitle(),
                media.getDescription(),
                media.getType(),
                media.getGenre(),
                media.getCategory(),
                media.getCreatedAt(),
                media.getUpdatedAt());
    }

    public Media toEntity(MediaRequest request) {
        if (request == null)
            return null;
        Media media = new Media();
        media.setTitle(request.title());
        media.setDescription(request.description());
        media.setType(request.type());
        media.setGenre(request.genre());
        media.setCategory(request.category());
        return media;
    }
}
