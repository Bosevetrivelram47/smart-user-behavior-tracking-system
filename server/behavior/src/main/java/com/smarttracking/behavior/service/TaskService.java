package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.entity.Task;
import com.smarttracking.behavior.entity.TaskStatus;
import com.smarttracking.behavior.entity.User;
import com.smarttracking.behavior.exception.TaskNotFoundException;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.repository.TaskRepository;

@Service
public class TaskService {

	// Dependency Injection
	private final TaskRepository taskRepository;
	private final UserService userService;
	private final UserActivityLogService userActivityLogService;

	public TaskService(TaskRepository taskRepository, UserService userService,
			UserActivityLogService userActivityLogService) {
		this.taskRepository = taskRepository;
		this.userService = userService;
		this.userActivityLogService = userActivityLogService;
	}

	// Task creation
	public Task createTask(Task task, Long creatorUserId) throws UserNotFoundException {
		User creator = userService.getUserById(creatorUserId);

		task.setCreatedBy(creator);
		task.setStatus(TaskStatus.PENDING);

		Task savedTask = taskRepository.save(task);

		userActivityLogService.logActivity(creator, "CREATE_TASK", "TASK");

		return savedTask;
	}

	// Getting particular task
	public Task getTaskById(Long taskId) throws TaskNotFoundException {
		return taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task not found"));
	}

	// Getting all tasks
	public List<Task> getAllTasks() {
		return taskRepository.findAll();
	}

	// Getting the task created by the particular user
	public List<Task> getTasksCreatedBy(Long userId) {
		return taskRepository.findAllByCreatedBy_UserId(userId);
	}

	// Getting tasks by status
	public List<Task> getTasksByStatus(TaskStatus status) {
		return taskRepository.findAllByStatus(status);
	}

	// To update the task status
	public Task updateTaskStatus(Long taskId, TaskStatus status, Long updatedByUserId)
			throws TaskNotFoundException, UserNotFoundException {
		Task task = getTaskById(taskId);

		if (task.getStatus() != status) {
			task.setStatus(status);
		}

		Task updatedTask = taskRepository.save(task);

		userActivityLogService.logActivity(userService.getUserById(updatedByUserId), "UPDATE_TASK_STATUS", "TASK");

		return updatedTask;
	}

	// Check if the task exists
	public boolean isTaskExists(Long taskId) {
		return taskRepository.existsById(taskId);
	}

}
