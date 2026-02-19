package com.smarttracking.behavior.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarttracking.behavior.dto.navigation.NavigationRequestDto;
import com.smarttracking.behavior.dto.navigation.NavigationResponseDto;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.service.NavigationLogService;

import jakarta.validation.Valid;

@RestController
@Validated
@RequestMapping("/api/navigation")
@CrossOrigin(origins = "http://localhost:5173")
public class NavigationLogController {
	private final NavigationLogService navigationLogService;

	public NavigationLogController(NavigationLogService navigationLogService) {
		this.navigationLogService = navigationLogService;
	}

	@PostMapping
	public NavigationResponseDto logNavigation(@Valid @RequestBody NavigationRequestDto dto)
			throws UserNotFoundException {
		return navigationLogService.logNavigation(dto);
	}

	@GetMapping("/user/{userId}")
	public List<NavigationResponseDto> getLogByUser(@PathVariable Long userId) {
		return navigationLogService.getLogByUser(userId);
	}

	@GetMapping
	public List<NavigationResponseDto> getAllLogs() {
		return navigationLogService.getAllLogs();
	}
}
