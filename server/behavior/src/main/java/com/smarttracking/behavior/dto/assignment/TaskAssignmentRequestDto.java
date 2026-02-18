package com.smarttracking.behavior.dto.assignment;

import jakarta.validation.constraints.NotNull;

public class TaskAssignmentRequestDto {

	@NotNull
	private Long taskId;

	@NotNull
	private Long assignedToUserId;

	@NotNull
	private Long assignedByUserId;

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public Long getAssignedToUserId() {
		return assignedToUserId;
	}

	public void setAssignedToUserId(Long assignedToUserId) {
		this.assignedToUserId = assignedToUserId;
	}

	public Long getAssignedByUserId() {
		return assignedByUserId;
	}

	public void setAssignedByUserId(Long assignedByUserId) {
		this.assignedByUserId = assignedByUserId;
	}

}
