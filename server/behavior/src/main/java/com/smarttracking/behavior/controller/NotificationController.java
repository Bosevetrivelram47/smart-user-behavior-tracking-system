package com.smarttracking.behavior.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarttracking.behavior.dto.notification.NotificationResponseDto;
import com.smarttracking.behavior.exception.NotificationNotFoundException;
import com.smarttracking.behavior.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

	private final NotificationService notificationService;

	public NotificationController(NotificationService notificationService) {
		this.notificationService = notificationService;
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<NotificationResponseDto>> getAllNotificationsByUser(@PathVariable Long userId) {
		return ResponseEntity.ok(notificationService.getAllNotificationsByUser(userId));
	}

	@GetMapping("/user/{userId}/unread")
	public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications(@PathVariable Long userId) {
		return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
	}

	@GetMapping("/user/{userId}/unread-count")
	public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
		return ResponseEntity.ok(notificationService.getUnreadCount(userId));
	}

	@PutMapping("/{notificationId}/mark-as-read")
	public ResponseEntity<NotificationResponseDto> markAsRead(@PathVariable Long notificationId)
			throws NotificationNotFoundException {
		return ResponseEntity.ok(notificationService.markAsRead(notificationId));
	}

}
