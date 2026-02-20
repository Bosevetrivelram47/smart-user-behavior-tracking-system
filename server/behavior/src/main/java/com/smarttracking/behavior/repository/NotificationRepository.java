package com.smarttracking.behavior.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	public List<Notification> findAllByUser_UserId(Long userId);

	public List<Notification> findAllByUser_UserIdAndIsReadIsFalse(Long userId);

	public long countByUser_UserIdAndIsReadIsFalse(Long userId);
}
