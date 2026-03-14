package com.mediahub.user.config;

import com.mediahub.user.entity.Role;
import com.mediahub.user.entity.User;
import com.mediahub.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding default admin and user...");

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@mediahub.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);

            User user = new User();
            user.setUsername("user");
            user.setEmail("user@mediahub.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(Role.USER);
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);

            log.info("Indexing complete. Admin: admin/admin123, User: user/user123");
        }
    }
}
