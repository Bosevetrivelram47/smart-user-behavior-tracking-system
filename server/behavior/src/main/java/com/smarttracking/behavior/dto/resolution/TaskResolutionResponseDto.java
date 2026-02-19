package com.smarttracking.behavior.dto.resolution;

import java.time.LocalDateTime;

public class TaskResolutionResponseDto {

	private Long resolutionId;
	private Long taskId;
	private String taskTitle;
	private Long resolvedByUserId;
	private String resolvedByUserName;
	private String remarks;
	private LocalDateTime resolvedAt;

	public Long getResolutionId() {
		return resolutionId;
	}

	public void setResolutionId(Long resolutionId) {
		this.resolutionId = resolutionId;
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

	public Long getResolvedByUserId() {
		return resolvedByUserId;
	}

	public void setResolvedByUserId(Long resolvedByUserId) {
		this.resolvedByUserId = resolvedByUserId;
	}

	public String getResolvedByUserName() {
		return resolvedByUserName;
	}

	public void setResolvedByUserName(String resolvedByUserName) {
		this.resolvedByUserName = resolvedByUserName;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public LocalDateTime getResolvedAt() {
		return resolvedAt;
	}

	public void setResolvedAt(LocalDateTime resolvedAt) {
		this.resolvedAt = resolvedAt;
	}

}
