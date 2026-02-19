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

import com.smarttracking.behavior.dto.resolution.TaskResolutionRequestDto;
import com.smarttracking.behavior.dto.resolution.TaskResolutionResponseDto;
import com.smarttracking.behavior.exception.TaskAlreadyCompletedException;
import com.smarttracking.behavior.exception.TaskNotFoundException;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.service.TaskResolutionService;

import jakarta.validation.Valid;

@RestController
@Validated
@RequestMapping("/api/resolutions")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskResolutionController {
	private final TaskResolutionService taskResolutionService;

	public TaskResolutionController(TaskResolutionService taskResolutionService) {
		this.taskResolutionService = taskResolutionService;
	}

	@PostMapping
	public ResponseEntity<TaskResolutionResponseDto> resolveTask(@Valid @RequestBody TaskResolutionRequestDto dto)
			throws TaskNotFoundException, UserNotFoundException, TaskAlreadyCompletedException {
		return ResponseEntity.ok(taskResolutionService.resolveTask(dto));
	}

	@GetMapping("/task/{taskId}")
	public ResponseEntity<List<TaskResolutionResponseDto>> getResolutionForTask(@PathVariable Long taskId) {
		return ResponseEntity.ok(taskResolutionService.getResolutionForTask(taskId));
	}
}
