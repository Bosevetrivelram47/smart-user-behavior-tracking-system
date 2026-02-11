package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.entity.Notification;
import com.smarttracking.behavior.entity.User;
import com.smarttracking.behavior.exception.NotificationNotFoundException;
import com.smarttracking.behavior.repository.NotificationRepository;

@Service
public class NotificationService {
	private final NotificationRepository notificationRepository;

	public NotificationService(NotificationRepository notificationRepository) {
		this.notificationRepository = notificationRepository;
	}

	// Created notification
	public Notification createNotification(User user, String message) {
		Notification notification = new Notification(user, message);

		return notificationRepository.save(notification);
	}

	// Get notification by user
	public List<Notification> getAllNotificationsByUser(Long userId) {
		return notificationRepository.findAllByUser_UserId(userId);
	}

	// Get unread notifications
	public List<Notification> getUnreadNotifications(Long userId) {
		return notificationRepository.findAllByUser_UserIdAndIsReadIsFalse(userId);
	}

	// Mark the notification as read
	public Notification markAsRead(Long notificationId) throws NotificationNotFoundException {
		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new NotificationNotFoundException("Notification not found"));

		notification.setIsRead(true);

		return notificationRepository.save(notification);
	}

}
