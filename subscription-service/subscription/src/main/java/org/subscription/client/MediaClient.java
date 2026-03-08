package org.subscription.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.subscription.dto.MediaDTO;

@FeignClient(name = "media-service")
public interface MediaClient {
    @GetMapping("/media/{id}")
    MediaDTO getMediaById(@PathVariable("id") Long id);
}
