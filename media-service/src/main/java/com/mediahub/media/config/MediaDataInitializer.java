package com.mediahub.media.config;

import com.mediahub.media.entity.MediaType;
import com.mediahub.media.entity.Genre;
import com.mediahub.media.entity.Media;
import com.mediahub.media.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MediaDataInitializer implements CommandLineRunner {

        private final MediaRepository mediaRepository;

        @Override
        public void run(String... args) {
                if (mediaRepository.count() == 0) {
                        List<Media> sampleMedia = List.of(
                                        createMedia("Inception",
                                                        "A thief who steals corporate secrets through the use of dream-sharing technology.",
                                                        MediaType.FILM, Genre.SCI_FI, "Sci-Fi"),
                                        createMedia("The Dark Knight",
                                                        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
                                                        MediaType.FILM, Genre.ACTION, "Action"),
                                        createMedia("Breaking Bad",
                                                        "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
                                                        MediaType.SERIES, Genre.DRAMA, "Drama"),
                                        createMedia("The Matrix",
                                                        "A computer hacker learns from mysterious rebels about the true nature of his reality.",
                                                        MediaType.FILM, Genre.SCI_FI, "Sci-Fi"),
                                        createMedia("Interstellar",
                                                        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                                                        MediaType.FILM, Genre.SCI_FI, "Sci-Fi"),
                                        createMedia("Stranger Things",
                                                        "When a young boy vanishes, a small town uncovers a mystery involving secret experiments and terrifying supernatural forces.",
                                                        MediaType.SERIES, Genre.SCI_FI, "Sci-Fi"),
                                        createMedia("The Godfather",
                                                        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
                                                        MediaType.FILM, Genre.DRAMA, "Drama"),
                                        createMedia("Pulp Fiction",
                                                        "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
                                                        MediaType.FILM, Genre.DRAMA, "Drama"),
                                        createMedia("Friends",
                                                        "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
                                                        MediaType.SERIES, Genre.COMEDY, "Comedy"),
                                        createMedia("The Shawshank Redemption",
                                                        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                                                        MediaType.FILM, Genre.DRAMA, "Drama"),
                                        createMedia("The Joe Rogan Experience",
                                                        "Long-form conversations with guests from all walks of life.",
                                                        MediaType.PODCAST, Genre.DOCUMENTARY, "Podcasts"));
                        mediaRepository.saveAll(sampleMedia);
                }
        }

        private Media createMedia(String title, String description, MediaType type, Genre genre,
                        String customCategory) {
                Media media = new Media();
                media.setTitle(title);
                media.setDescription(description);
                media.setCategory(customCategory);
                media.setType(type);
                media.setGenre(genre);
                return media;
        }
}
