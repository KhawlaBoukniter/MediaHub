package com.mediahub.media.controller;

import com.mediahub.media.dto.MediaRequest;
import com.mediahub.media.dto.MediaResponse;
import com.mediahub.media.entity.Genre;
import com.mediahub.media.entity.MediaType;
import com.mediahub.media.service.MediaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping
    public ResponseEntity<List<MediaResponse>> findAll() {
        return ResponseEntity.ok(mediaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(mediaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<MediaResponse> create(@Valid @RequestBody MediaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mediaService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MediaResponse> update(@PathVariable Long id,
            @Valid @RequestBody MediaRequest request) {
        return ResponseEntity.ok(mediaService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mediaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MediaResponse>> findByCategory(@PathVariable String category) {
        return ResponseEntity.ok(mediaService.findByCategory(category));
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<MediaResponse>> findByGenre(@PathVariable Genre genre) {
        return ResponseEntity.ok(mediaService.findByGenre(genre));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MediaResponse>> search(@RequestParam String title) {
        return ResponseEntity.ok(mediaService.searchByTitle(title));
    }

}
