package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

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

	// Assign task
	public TaskAssignment assignTask(Long taskId, Long assignedToUserId, Long assignedByUserId)
			throws TaskNotFoundException, UserNotFoundException, ExistedException {
		Task task = taskService.getTaskById(taskId);
		User assignedTo = userService.getUserById(assignedToUserId);
		User assignedBy = userService.getUserById(assignedByUserId);

		boolean alreadyAssigned = taskAssignmentRepository.existsByTask_TaskIdAndAssignedTo_UserId(taskId,
				assignedToUserId);

		if (alreadyAssigned) {
			throw new ExistedException("Task is already assigned to the user");
		}

		TaskAssignment assignment = new TaskAssignment(task, assignedTo, assignedBy);

		TaskAssignment savedAssignment = taskAssignmentRepository.save(assignment);

		userActivityLogService.logActivity(assignedBy, "ASSIGNED_TASK", "TASK");

		notificationService.createNotification(assignedTo, "You have been assigned to a new task: " + task.getTitle());

		return savedAssignment;
	}

	// Get all assigned tasks for specific user
	public List<TaskAssignment> getAssignmentsForUser(Long userId) {
		return taskAssignmentRepository.findAllByAssignedTo_UserId(userId);
	}

	// Get the history of a task
	public List<TaskAssignment> getAssignmentsForTask(Long taskId) {
		return taskAssignmentRepository.findAllByTask_TaskId(taskId);
	}
}
