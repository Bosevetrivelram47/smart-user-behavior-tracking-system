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

import com.smarttracking.behavior.dto.assignment.TaskAssignmentRequestDto;
import com.smarttracking.behavior.dto.assignment.TaskAssignmentResponseDto;
import com.smarttracking.behavior.exception.ExistedException;
import com.smarttracking.behavior.exception.TaskNotFoundException;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.service.TaskAssignmentService;

import jakarta.validation.Valid;

@RestController
@Validated
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskAssignmentController {

	private TaskAssignmentService taskAssignmentService;

	public TaskAssignmentController(TaskAssignmentService taskAssignmentService) {
		this.taskAssignmentService = taskAssignmentService;
	}

	@PostMapping
	public ResponseEntity<TaskAssignmentResponseDto> assignTask(@Valid @RequestBody TaskAssignmentRequestDto dto)
			throws TaskNotFoundException, UserNotFoundException, ExistedException {
		return ResponseEntity.ok(taskAssignmentService.assignTask(dto));
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<TaskAssignmentResponseDto>> getAssignmentsForUser(@PathVariable Long userId) {
		return ResponseEntity.ok(taskAssignmentService.getAssignmentsForUser(userId));
	}

	@GetMapping("/task/{taskId}")
	public ResponseEntity<List<TaskAssignmentResponseDto>> getAssignmentsForTask(@PathVariable Long taskId) {
		return ResponseEntity.ok(taskAssignmentService.getAssignmentsForTask(taskId));
	}
}
