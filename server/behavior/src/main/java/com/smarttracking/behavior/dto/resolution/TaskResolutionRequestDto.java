package com.smarttracking.behavior.dto.resolution;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TaskResolutionRequestDto {

	@NotNull
	private Long taskId;

	@NotNull
	private Long resolvedByUserId;

	@NotBlank
	private String remarks;

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public Long getResolvedByUserId() {
		return resolvedByUserId;
	}

	public void setResolvedByUserId(Long resolvedByUserId) {
		this.resolvedByUserId = resolvedByUserId;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

}
