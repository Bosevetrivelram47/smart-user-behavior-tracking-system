package com.smarttracking.behavior.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarttracking.behavior.dto.navigation.NavigationLogRequestDto;
import com.smarttracking.behavior.dto.navigation.NavigationLogResponseDto;
import com.smarttracking.behavior.dto.navigation.PageAnalyticsDto;
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
	public ResponseEntity<NavigationLogResponseDto> logNavigation(@Valid @RequestBody NavigationLogRequestDto dto)
			throws UserNotFoundException {
		return ResponseEntity.ok(navigationLogService.logNavigation(dto));
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<NavigationLogResponseDto>> getLogByUser(@PathVariable Long userId) {
		return ResponseEntity.ok(navigationLogService.getLogByUser(userId));
	}

	@GetMapping
	public ResponseEntity<List<NavigationLogResponseDto>> getAllLogs() {
		return ResponseEntity.ok(navigationLogService.getAllLogs());
	}

	@GetMapping("/analytics/most-visited")
	public ResponseEntity<List<PageAnalyticsDto>> getMostVisistedPages() {
		return ResponseEntity.ok(navigationLogService.getMostVisitedPages());
	}
}
