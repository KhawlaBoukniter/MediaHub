/**
 * Model representing a Media item in the catalog.
 */
export interface Media {
    id: number;
    title: string;
    description: string;
    type: string;
    category: string;
    genre: string;
    releaseDate: string;
    duration: number; // in minutes
    posterUrl: string; // URL for the image
    trailerUrl?: string;
}

/**
 * Statistics or viewing history entry.
 */
export interface ViewingHistory {
    id: number;
    userId: number;
    mediaId: number;
    watchedAt: string;
    media?: Media; // Populated for UI
}
