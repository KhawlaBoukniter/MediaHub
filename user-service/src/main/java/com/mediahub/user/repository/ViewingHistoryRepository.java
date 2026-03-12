package com.mediahub.user.repository;

import com.mediahub.user.entity.ViewingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViewingHistoryRepository extends JpaRepository<ViewingHistory, Long> {

    List<ViewingHistory> findByUserIdOrderByWatchedAtDesc(Long userId);
}
