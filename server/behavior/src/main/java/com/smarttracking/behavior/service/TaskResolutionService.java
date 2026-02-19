package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.dto.resolution.TaskResolutionRequestDto;
import com.smarttracking.behavior.dto.resolution.TaskResolutionResponseDto;
import com.smarttracking.behavior.entity.Task;
import com.smarttracking.behavior.entity.TaskResolution;
import com.smarttracking.behavior.entity.TaskStatus;
import com.smarttracking.behavior.entity.User;
import com.smarttracking.behavior.exception.TaskAlreadyCompletedException;
import com.smarttracking.behavior.exception.TaskNotFoundException;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.repository.TaskAssignmentRepository;
import com.smarttracking.behavior.repository.TaskResolutionRepository;

import jakarta.transaction.Transactional;

@Service
public class TaskResolutionService {
	private final TaskResolutionRepository taskResolutionRepository;
	private final TaskAssignmentRepository taskAssignmentRepository;
	private final TaskService taskService;
	private final UserService userService;
	private final UserActivityLogService userActivityLogService;
	private final NotificationService notificationService;

	public TaskResolutionService(TaskResolutionRepository taskResolutionRepository,
			TaskAssignmentRepository taskAssignmentRepository, TaskService taskService, UserService userService,
			UserActivityLogService userActivityLogService, NotificationService notificationService) {
		this.taskResolutionRepository = taskResolutionRepository;
		this.taskAssignmentRepository = taskAssignmentRepository;
		this.taskService = taskService;
		this.userService = userService;
		this.userActivityLogService = userActivityLogService;
		this.notificationService = notificationService;
	}

	// DTO response
	public TaskResolutionResponseDto mapToResponse(TaskResolution taskResolution) {
		TaskResolutionResponseDto dto = new TaskResolutionResponseDto();
		dto.setResolutionId(taskResolution.getResolutionId());
		dto.setTaskId(taskResolution.getTask().getTaskId());
		dto.setTaskTitle(taskResolution.getTask().getTitle());
		dto.setResolvedByUserId(taskResolution.getResolvedBy().getUserId());
		dto.setResolvedByUserName(taskResolution.getResolvedBy().getName());
		dto.setRemarks(taskResolution.getRemarks());
		dto.setResolvedAt(taskResolution.getResolvedAt());

		return dto;
	}

	// Resolve the task
	@Transactional
	public TaskResolutionResponseDto resolveTask(TaskResolutionRequestDto dto)
			throws TaskNotFoundException, UserNotFoundException, TaskAlreadyCompletedException {

		// To check correct resolver to the assigned task
		boolean isAssigned = taskAssignmentRepository.existsByTask_TaskIdAndAssignedTo_UserId(dto.getTaskId(),
				dto.getResolvedByUserId());

		if (!isAssigned) {
			throw new IllegalStateException("User is not assigned to this task");
		}

		Task task = taskService.getTaskEntityById(dto.getTaskId());
		User resolvedBy = userService.getUserEntityById(dto.getResolvedByUserId());

		if (task.getStatus() == TaskStatus.COMPLETED) {
			throw new TaskAlreadyCompletedException("Task is already completed");
		}

		TaskResolution resolution = new TaskResolution(task, resolvedBy, dto.getRemarks());

		TaskResolution savedResolution = taskResolutionRepository.save(resolution);

		taskService.updateTaskStatus(task.getTaskId(), TaskStatus.COMPLETED, resolvedBy.getUserId());

		userActivityLogService.logActivity(resolvedBy, "RESOLVED_TASK", "TASK");

		notificationService.createNotification(task.getCreatedBy(), "Task Completed: " + task.getTitle());

		return mapToResponse(savedResolution);
	}

	public List<TaskResolutionResponseDto> getResolutionForTask(Long taskId) {
		return taskResolutionRepository.findAllByTask_TaskId(taskId).stream().map(this::mapToResponse).toList();
	}

}
