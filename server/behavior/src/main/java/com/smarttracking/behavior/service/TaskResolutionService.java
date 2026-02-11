package com.smarttracking.behavior.service;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.entity.Task;
import com.smarttracking.behavior.entity.TaskResolution;
import com.smarttracking.behavior.entity.TaskStatus;
import com.smarttracking.behavior.entity.User;
import com.smarttracking.behavior.exception.TaskAlreadyCompletedException;
import com.smarttracking.behavior.exception.TaskNotFoundException;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.repository.TaskResolutionRepository;

import jakarta.transaction.Transactional;

@Service
public class TaskResolutionService {
	private final TaskResolutionRepository taskResolutionRepository;
	private final TaskService taskService;
	private final UserService userService;
	private final UserActivityLogService userActivityLogService;
	private final NotificationService notificationService;

	public TaskResolutionService(TaskResolutionRepository taskResolutionRepository, TaskService taskService,
			UserService userService, UserActivityLogService userActivityLogService,
			NotificationService notificationService) {
		this.taskResolutionRepository = taskResolutionRepository;
		this.taskService = taskService;
		this.userService = userService;
		this.userActivityLogService = userActivityLogService;
		this.notificationService = notificationService;
	}

	// Resolve the task
	@Transactional
	public TaskResolution resolveTask(Long taskId, Long resolvedByUserId, String remarks)
			throws TaskNotFoundException, UserNotFoundException, TaskAlreadyCompletedException {
		Task task = taskService.getTaskById(taskId);
		User resolvedBy = userService.getUserById(resolvedByUserId);

		if (task.getStatus() == TaskStatus.COMPLETED) {
			throw new TaskAlreadyCompletedException("Task is already completed");
		}

		TaskResolution resolution = new TaskResolution(task, resolvedBy, remarks);

		TaskResolution savedResolution = taskResolutionRepository.save(resolution);

		taskService.updateTaskStatus(taskId, TaskStatus.COMPLETED, resolvedByUserId);

		userActivityLogService.logActivity(resolvedBy, "RESOLVED_TASK", "TASK");

		notificationService.createNotification(task.getCreatedBy(), "Task Completed: " + task.getTitle());

		return savedResolution;
	}

}
