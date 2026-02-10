package com.smarttracking.behavior.service;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.entity.User;
import com.smarttracking.behavior.entity.UserActivityLog;
import com.smarttracking.behavior.repository.UserActivityLogRepository;

@Service
public class UserActivityLogService {

	// Dependency Injection
	private final UserActivityLogRepository userActivityLogRepository;

	public UserActivityLogService(UserActivityLogRepository userActivityLogRepository) {
		this.userActivityLogRepository = userActivityLogRepository;
	}

	// To save the log of the user
	public void logActivity(User user, String action, String module) {
		UserActivityLog log = new UserActivityLog(user, action, module);
		userActivityLogRepository.save(log);
	}
}
