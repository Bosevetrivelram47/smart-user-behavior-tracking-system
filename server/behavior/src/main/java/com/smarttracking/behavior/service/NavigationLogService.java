package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.dto.navigation.NavigationRequestDto;
import com.smarttracking.behavior.dto.navigation.NavigationResponseDto;
import com.smarttracking.behavior.entity.NavigationLog;
import com.smarttracking.behavior.entity.User;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.repository.NavigationLogRepository;

@Service
public class NavigationLogService {

	// Dependency Injection
	private final UserService userService;
	private final NavigationLogRepository navigationLogRepository;

	public NavigationLogService(UserService userService, NavigationLogRepository navigationLogRepository) {
		this.userService = userService;
		this.navigationLogRepository = navigationLogRepository;
	}

	// DTO response
	public NavigationResponseDto mapToResponse(NavigationLog log) {
		NavigationResponseDto dto = new NavigationResponseDto();

		dto.setNavigationId(log.getNavigationId());
		dto.setUserId(log.getUser().getUserId());
		dto.setUserName(log.getUser().getName());
		dto.setPageName(log.getPageName());
		dto.setTimeSpentSeconds(log.getTimeSpentSeconds());
		dto.setVisitedAt(log.getVisitedAt());

		return dto;
	}

	// Logs the navigation
	public NavigationResponseDto logNavigation(NavigationRequestDto dto) throws UserNotFoundException {
		User user = userService.getUserEntityById(dto.getUserId());

		NavigationLog log = new NavigationLog(user, dto.getPageName(), dto.getTimeSpentSeconds());

		NavigationLog savedLog = navigationLogRepository.save(log);

		return mapToResponse(savedLog);
	}

	// Get logs by user
	public List<NavigationResponseDto> getLogByUser(Long userId) {
		return navigationLogRepository.findByUser_UserId(userId).stream().map(this::mapToResponse).toList();
	}

	// Gives all logs
	public List<NavigationResponseDto> getAllLogs() {
		return navigationLogRepository.findAll().stream().map(this::mapToResponse).toList();
	}

}
