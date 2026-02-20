package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.dto.notification.NotificationResponseDto;
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

	// DTO response
	public NotificationResponseDto mapToResponse(Notification notification) {
		NotificationResponseDto dto = new NotificationResponseDto();

		dto.setUserId(notification.getUser().getUserId());
		dto.setNotificationId(notification.getNotificationId());
		dto.setMessage(notification.getMessage());
		dto.setRead(notification.getIsRead());
		dto.setCreatedAt(notification.getCreatedAt());

		return dto;
	}

	// Created notification
	public NotificationResponseDto createNotification(User user, String message) {
		Notification notification = new Notification(user, message);

		return mapToResponse(notificationRepository.save(notification));
	}

	// Get notification by user
	public List<NotificationResponseDto> getAllNotificationsByUser(Long userId) {
		return notificationRepository.findAllByUser_UserId(userId).stream().map(this::mapToResponse).toList();
	}

	// Get unread notifications
	public List<NotificationResponseDto> getUnreadNotifications(Long userId) {
		return notificationRepository.findAllByUser_UserIdAndIsReadIsFalse(userId).stream().map(this::mapToResponse)
				.toList();
	}

	// Mark the notification as read
	public NotificationResponseDto markAsRead(Long notificationId) throws NotificationNotFoundException {
		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new NotificationNotFoundException("Notification not found"));

		notification.setIsRead(true);

		return mapToResponse(notificationRepository.save(notification));
	}

	public long getUnreadCount(Long userId) {
		return notificationRepository.countByUser_UserIdAndIsReadIsFalse(userId);
	}

}
