package com.mediahub.media.service;

import com.mediahub.media.dto.MediaRequest;
import com.mediahub.media.dto.MediaResponse;
import com.mediahub.media.entity.Genre;
import com.mediahub.media.entity.Media;
import com.mediahub.media.entity.MediaType;
import com.mediahub.media.exception.ResourceNotFoundException;
import com.mediahub.media.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> findAll() {
        return mediaRepository.findAll()
                .stream()
                .map(MediaResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MediaResponse findById(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + id));
        return MediaResponse.from(media);
    }

    @Override
    @Transactional
    public MediaResponse create(MediaRequest request) {
        Media media = Media.builder()
                .title(request.title())
                .description(request.description())
                .type(request.type())
                .genre(request.genre())
                .category(request.category())
                .releaseDate(request.releaseDate())
                .duration(request.duration())
                .build();
        Media saved = mediaRepository.save(media);
        return MediaResponse.from(saved);
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
        existing.setReleaseDate(request.releaseDate());
        existing.setDuration(request.duration());

        Media updated = mediaRepository.save(existing);
        return MediaResponse.from(updated);
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
                .map(MediaResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> findByGenre(Genre genre) {
        return mediaRepository.findByGenre(genre)
                .stream()
                .map(MediaResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> findByType(MediaType type) {
        return mediaRepository.findByType(type)
                .stream()
                .map(MediaResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> search(String title) {
        return mediaRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(MediaResponse::from)
                .toList();
    }
}
