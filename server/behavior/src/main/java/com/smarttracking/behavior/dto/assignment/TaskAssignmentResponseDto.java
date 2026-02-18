package com.smarttracking.behavior.dto.assignment;

import java.time.LocalDateTime;

public class TaskAssignmentResponseDto {

	private Long assignmentId;
	private Long taskId;
	private String taskTitle;
	private Long assignedToUserId;
	private String assignedToUserName;
	private Long assignedByUserId;
	private String assignedByUserName;
	private LocalDateTime assignedAt;

	public Long getAssignmentId() {
		return assignmentId;
	}

	public void setAssignmentId(Long assignmentId) {
		this.assignmentId = assignmentId;
	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public String getTaskTitle() {
		return taskTitle;
	}

	public void setTaskTitle(String taskTitle) {
		this.taskTitle = taskTitle;
	}

	public Long getAssignedToUserId() {
		return assignedToUserId;
	}

	public void setAssignedToUserId(Long assignedToUserId) {
		this.assignedToUserId = assignedToUserId;
	}

	public String getAssignedToUserName() {
		return assignedToUserName;
	}

	public void setAssignedToUserName(String assignedToUserName) {
		this.assignedToUserName = assignedToUserName;
	}

	public Long getAssignedByUserId() {
		return assignedByUserId;
	}

	public void setAssignedByUserId(Long assignedByUserId) {
		this.assignedByUserId = assignedByUserId;
	}

	public String getAssignedByUserName() {
		return assignedByUserName;
	}

	public void setAssignedByUserName(String assignedByUserName) {
		this.assignedByUserName = assignedByUserName;
	}

	public LocalDateTime getAssignedAt() {
		return assignedAt;
	}

	public void setAssignedAt(LocalDateTime assignedAt) {
		this.assignedAt = assignedAt;
	}

}
