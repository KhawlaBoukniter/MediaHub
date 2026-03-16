package com.mediahub.user.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "media-service")
public interface MediaClient {

    @GetMapping("/api/media/{id}")
    Object getMediaById(@PathVariable("id") Long id);
}
