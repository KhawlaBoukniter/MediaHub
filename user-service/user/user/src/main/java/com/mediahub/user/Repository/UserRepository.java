package com.mediahub.user.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediahub.user.Model.User;

public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findByEmail(String email);
}
