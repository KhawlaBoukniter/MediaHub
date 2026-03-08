package org.subscription.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.subscription.client.MediaClient;
import org.subscription.client.UserClient;
import org.subscription.dto.MediaDTO;
import org.subscription.model.Subscription;
import org.subscription.repository.SubscriptionRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final UserClient userClient;
    private final MediaClient mediaClient;
    private final WebClient.Builder webClientBuilder;

    @Transactional
    public Subscription createSubscription(Long userId, Long mediaId) {

        userClient.getUserById(userId);
        mediaClient.getMediaById(mediaId);

        List<Subscription> activeSubs = subscriptionRepository.findAll().stream()
            .filter(s -> s.getUserId().equals(userId) && s.getMediaId().equals(mediaId) && "ACTIF".equals(s.getStatus()))
            .toList();
        
        if (!activeSubs.isEmpty()) {
            throw new RuntimeException("Cet utilisateur a déjà un abonnement actif");
        }

        Subscription sub = new Subscription();
        sub.setUserId(userId);
        sub.setMediaId(mediaId);
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusMonths(1));
        sub.setStatus("ACTIF");

        return subscriptionRepository.save(sub);
    }

    @Override
    public String getSubscriptionDetails(Long id) {
        Subscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement introuvable"));

        MediaDTO media = webClientBuilder.build()
                .get()
                .uri("http://media-service/media/" + sub.getMediaId())
                .retrieve()
                .bodyToMono(MediaDTO.class)
                .block();

        return "Abonnement " + sub.getStatus() + " pour le média : " + (media != null ? media.getTitle() : "Inconnu");
    }

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }
}
