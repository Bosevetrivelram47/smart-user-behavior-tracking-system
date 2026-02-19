package com.smarttracking.behavior.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smarttracking.behavior.dto.task.TaskRequestDto;
import com.smarttracking.behavior.dto.task.TaskResponseDto;
import com.smarttracking.behavior.entity.TaskStatus;
import com.smarttracking.behavior.exception.TaskNotFoundException;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.service.TaskService;

import jakarta.validation.Valid;

@RestController
@Validated
@RequestMapping("api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {
	private final TaskService taskService;

	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}

	@PostMapping
	public ResponseEntity<TaskResponseDto> createTask(@Valid @RequestBody TaskRequestDto dto)
			throws UserNotFoundException {
		return new ResponseEntity<>(taskService.createTask(dto), HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable Long id) throws TaskNotFoundException {
		return ResponseEntity.ok(taskService.getTaskById(id));
	}

	@GetMapping
	public ResponseEntity<List<TaskResponseDto>> getAllTasks() {
		return ResponseEntity.ok(taskService.getAllTasks());
	}

	@GetMapping("/created-by/{userId}")
	public ResponseEntity<List<TaskResponseDto>> getTasksCreatedBy(@PathVariable Long userId) {
		return ResponseEntity.ok(taskService.getTasksCreatedBy(userId));
	}

	@GetMapping("/status/{status}")
	public ResponseEntity<List<TaskResponseDto>> getTasksByStatus(@PathVariable TaskStatus status) {
		return ResponseEntity.ok(taskService.getTasksByStatus(status));
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<TaskResponseDto> updateTaskStatus(@PathVariable Long id, @RequestParam TaskStatus status,
			@RequestParam Long updatedByUserId) throws TaskNotFoundException, UserNotFoundException {
		return ResponseEntity.ok(taskService.updateTaskStatus(id, status, updatedByUserId));
	}

}
