package com.smarttracking.behavior.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

}
