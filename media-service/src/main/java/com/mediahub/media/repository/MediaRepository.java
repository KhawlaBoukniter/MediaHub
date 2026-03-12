package com.mediahub.media.repository;

import com.mediahub.media.entity.Genre;
import com.mediahub.media.entity.Media;
import com.mediahub.media.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

    List<Media> findByCategory(String category);

    List<Media> findByGenre(Genre genre);

    List<Media> findByType(MediaType type);

    List<Media> findByTitleContainingIgnoreCase(String title);

    List<Media> findByGenreAndType(Genre genre, MediaType type);
}
