package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.dto.task.TaskRequestDto;
import com.smarttracking.behavior.dto.task.TaskResponseDto;
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

	// DTO response
	public TaskResponseDto mapToResponse(Task task) {
		TaskResponseDto dto = new TaskResponseDto();
		dto.setTaskId(task.getTaskId());
		dto.setTitle(task.getTitle());
		dto.setDescription(task.getDescription());
		dto.setPriority(task.getPriority());
		dto.setStatus(task.getStatus());
		dto.setCreatedByUserId(task.getCreatedBy().getUserId());
		dto.setCreatedByUserName(task.getCreatedBy().getName());
		dto.setCreatedAt(task.getCreatedAt());

		return dto;
	}

	// Task creation
	public TaskResponseDto createTask(TaskRequestDto dto) throws UserNotFoundException {
		User creator = userService.getUserEntityById(dto.getCreatedByUserId());

		Task task = new Task(dto.getTitle(), dto.getDescription(), dto.getPriority(), TaskStatus.PENDING, creator);

		Task savedTask = taskRepository.save(task);

		userActivityLogService.logActivity(creator, "CREATE_TASK", "TASK");

		return mapToResponse(savedTask);
	}

	// Getting particular task
	public TaskResponseDto getTaskById(Long taskId) throws TaskNotFoundException {
		Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task not found"));

		return mapToResponse(task);
	}

	public Task getTaskEntityById(Long taskId) throws TaskNotFoundException {
		Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task not found"));

		return task;
	}

	// Getting all tasks
	public List<TaskResponseDto> getAllTasks() {
		return taskRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	// Getting the task created by the particular user
	public List<TaskResponseDto> getTasksCreatedBy(Long userId) {
		return taskRepository.findAllByCreatedBy_UserId(userId).stream().map(this::mapToResponse).toList();
	}

	// Getting tasks by status
	public List<TaskResponseDto> getTasksByStatus(TaskStatus status) {
		return taskRepository.findAllByStatus(status).stream().map(this::mapToResponse).toList();
	}

	// To update the task status
	public TaskResponseDto updateTaskStatus(Long taskId, TaskStatus status, Long updatedByUserId)
			throws TaskNotFoundException, UserNotFoundException {
		Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task not found"));
		User creator = userService.getUserEntityById(updatedByUserId);

		if (task.getStatus() != status) {
			task.setStatus(status);
		}

		Task updatedTask = taskRepository.save(task);

		userActivityLogService.logActivity(creator, "UPDATE_TASK_STATUS", "TASK");

		return mapToResponse(updatedTask);
	}

	// Check if the task exists
	public boolean isTaskExists(Long taskId) {
		return taskRepository.existsById(taskId);
	}

}
