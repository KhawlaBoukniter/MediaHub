package com.mediahub.media.service;

import com.mediahub.media.dto.MediaRequest;
import com.mediahub.media.dto.MediaResponse;
import com.mediahub.media.entity.Genre;
import com.mediahub.media.entity.Media;
import com.mediahub.media.exception.ResourceNotFoundException;
import com.mediahub.media.mapper.MediaMapper;
import com.mediahub.media.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;
    private final MediaMapper mediaMapper;

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> findAll() {
        return mediaRepository.findAll()
                .stream()
                .map(mediaMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MediaResponse findById(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + id));
        return mediaMapper.toResponse(media);
    }

    @Override
    @Transactional
    public MediaResponse create(MediaRequest request) {
        Media media = mediaMapper.toEntity(request);
        Media saved = mediaRepository.save(media);
        return mediaMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public MediaResponse update(Long id, MediaRequest request) {
        Media existing = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + id));

        existing.setTitle(request.title());
        existing.setDescription(request.description());
        existing.setType(request.type());
        existing.setGenre(request.genre());
        existing.setCategory(request.category());

        Media updated = mediaRepository.save(existing);
        return mediaMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!mediaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Media not found with id: " + id);
        }
        mediaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> findByCategory(String category) {
        return mediaRepository.findByCategory(category)
                .stream()
                .map(mediaMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> findByGenre(Genre genre) {
        return mediaRepository.findByGenre(genre)
                .stream()
                .map(mediaMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> searchByTitle(String title) {
        return mediaRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(mediaMapper::toResponse)
                .toList();
    }
}
