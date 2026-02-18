package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.dto.assignment.TaskAssignmentRequestDto;
import com.smarttracking.behavior.dto.assignment.TaskAssignmentResponseDto;
import com.smarttracking.behavior.entity.Task;
import com.smarttracking.behavior.entity.TaskAssignment;
import com.smarttracking.behavior.entity.User;
import com.smarttracking.behavior.exception.ExistedException;
import com.smarttracking.behavior.exception.TaskNotFoundException;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.repository.TaskAssignmentRepository;

@Service
public class TaskAssignmentService {
	private final TaskAssignmentRepository taskAssignmentRepository;
	private final TaskService taskService;
	private final UserService userService;
	private final UserActivityLogService userActivityLogService;
	private final NotificationService notificationService;

	public TaskAssignmentService(TaskAssignmentRepository taskAssignmentRepository, TaskService taskService,
			UserService userService, UserActivityLogService userActivityLogService,
			NotificationService notificationService) {
		this.taskAssignmentRepository = taskAssignmentRepository;
		this.taskService = taskService;
		this.userService = userService;
		this.userActivityLogService = userActivityLogService;
		this.notificationService = notificationService;
	}

	// DTO response
	public TaskAssignmentResponseDto mapToResponse(TaskAssignment taskAssignment) {
		TaskAssignmentResponseDto dto = new TaskAssignmentResponseDto();
		dto.setAssignmentId(taskAssignment.getAssignmentId());
		dto.setTaskId(taskAssignment.getTask().getTaskId());
		dto.setTaskTitle(taskAssignment.getTask().getTitle());
		dto.setAssignedToUserId(taskAssignment.getAssignedTo().getUserId());
		dto.setAssignedToUserName(taskAssignment.getAssignedTo().getName());
		dto.setAssignedByUserId(taskAssignment.getAssignedBy().getUserId());
		dto.setAssignedByUserName(taskAssignment.getAssignedBy().getName());
		dto.setAssignedAt(taskAssignment.getAssignedAt());

		return dto;
	}

	// Assign task
	public TaskAssignmentResponseDto assignTask(TaskAssignmentRequestDto dto)
			throws TaskNotFoundException, UserNotFoundException, ExistedException {
		Task task = taskService.getTaskEntityById(dto.getTaskId());
		User assignedTo = userService.getUserEntityById(dto.getAssignedToUserId());
		User assignedBy = userService.getUserEntityById(dto.getAssignedByUserId());

		boolean alreadyAssigned = taskAssignmentRepository.existsByTask_TaskIdAndAssignedTo_UserId(dto.getTaskId(),
				dto.getAssignedToUserId());

		if (alreadyAssigned) {
			throw new ExistedException("Task is already assigned to the user");
		}

		TaskAssignment assignment = new TaskAssignment(task, assignedTo, assignedBy);

		TaskAssignment savedAssignment = taskAssignmentRepository.save(assignment);

		userActivityLogService.logActivity(assignedBy, "ASSIGNED_TASK", "TASK");

		notificationService.createNotification(assignedTo, "You have been assigned to a new task: " + task.getTitle());

		return mapToResponse(savedAssignment);
	}

	// Get all assigned tasks for specific user
	public List<TaskAssignmentResponseDto> getAssignmentsForUser(Long userId) {
		return taskAssignmentRepository.findAllByAssignedTo_UserId(userId).stream().map(this::mapToResponse).toList();
	}

	// Get the history of a task
	public List<TaskAssignmentResponseDto> getAssignmentsForTask(Long taskId) {
		return taskAssignmentRepository.findAllByTask_TaskId(taskId).stream().map(this::mapToResponse).toList();
	}
}
