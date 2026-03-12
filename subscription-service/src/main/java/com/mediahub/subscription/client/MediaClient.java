package com.mediahub.subscription.client;

import com.mediahub.subscription.dto.MediaResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "media-service")
public interface MediaClient {

    @GetMapping("/api/media/{id}")
    MediaResponse getMediaById(@PathVariable Long id);

    @GetMapping("/api/media")
    List<MediaResponse> getAllMedia();
}
