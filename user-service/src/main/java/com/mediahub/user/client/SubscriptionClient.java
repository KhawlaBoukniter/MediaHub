package com.mediahub.user.client;

import com.mediahub.user.dto.SubscriptionResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "subscription-service")
public interface SubscriptionClient {

    @GetMapping("/api/subscriptions/user/{userId}")
    SubscriptionResponse getSubscriptionByUserId(@PathVariable("userId") Long userId);
}
