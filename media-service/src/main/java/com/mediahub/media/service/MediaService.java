package com.mediahub.media.service;

import com.mediahub.media.dto.MediaRequest;
import com.mediahub.media.dto.MediaResponse;
import com.mediahub.media.entity.Genre;
import com.mediahub.media.entity.MediaType;

import java.util.List;

public interface MediaService {

    List<MediaResponse> findAll();

    MediaResponse findById(Long id);

    MediaResponse create(MediaRequest request);

    MediaResponse update(Long id, MediaRequest request);

    void delete(Long id);

    List<MediaResponse> findByCategory(String category);

    List<MediaResponse> findByGenre(Genre genre);

    List<MediaResponse> findByType(MediaType type);

    List<MediaResponse> search(String title);
}
