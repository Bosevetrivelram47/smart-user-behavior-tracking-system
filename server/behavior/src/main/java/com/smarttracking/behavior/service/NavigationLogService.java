package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.dto.navigation.NavigationLogRequestDto;
import com.smarttracking.behavior.dto.navigation.NavigationLogResponseDto;
import com.smarttracking.behavior.dto.navigation.PageAnalyticsDto;
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
	public NavigationLogResponseDto mapToResponse(NavigationLog log) {
		NavigationLogResponseDto dto = new NavigationLogResponseDto();

		dto.setNavigationId(log.getNavigationId());
		dto.setUserId(log.getUser().getUserId());
		dto.setUserName(log.getUser().getName());
		dto.setPageName(log.getPageName());
		dto.setTimeSpentSeconds(log.getTimeSpentSeconds());
		dto.setVisitedAt(log.getVisitedAt());

		return dto;
	}

	// Logs the navigation
	public NavigationLogResponseDto logNavigation(NavigationLogRequestDto dto) throws UserNotFoundException {
		User user = userService.getUserEntityById(dto.getUserId());

		NavigationLog log = new NavigationLog(user, dto.getPageName(), dto.getTimeSpentSeconds());

		NavigationLog savedLog = navigationLogRepository.save(log);

		return mapToResponse(savedLog);
	}

	// Get logs by user
	public List<NavigationLogResponseDto> getLogByUser(Long userId) {
		return navigationLogRepository.findAllByUser_UserId(userId).stream().map(this::mapToResponse).toList();
	}

	// Gives all logs
	public List<NavigationLogResponseDto> getAllLogs() {
		return navigationLogRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	// Get most visited pages
	public List<PageAnalyticsDto> getMostVisitedPages() {
		return navigationLogRepository.getMostVisitedPages().stream().map(obj -> {
			PageAnalyticsDto dto = new PageAnalyticsDto();
			dto.setPageName((String) obj[0]);
			dto.setVisitCount((Long) obj[1]);

			return dto;
		}).toList();
	}

}
