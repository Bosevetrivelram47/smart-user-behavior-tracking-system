package com.smarttracking.behavior.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "task_resolutions")
public class TaskResolution {

	// Auto incrementing id
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "resolution_id")
	private Long resolutionId;

	// task refers to the tasks in the Task Entity
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "task_id", nullable = false)
	private Task task;

	// resolvedBy refers to the user in the User Entity
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "resolved_by", nullable = false)
	private User resolvedBy;

	@Column
	private String remarks;

	// DB will manage the resolvedAt
	@Column(name = "resolved_at", insertable = false, updatable = false)
	private LocalDateTime resolvedAt;

	// Constructor For hibernate reflection
	protected TaskResolution() {
	}

	// Parameterized Constructor
	public TaskResolution(Task task, User resolvedBy, String remarks) {
		this.task = task;
		this.resolvedBy = resolvedBy;
		this.remarks = remarks;
	}

	// Getters and Setters
	public Long getResolutionId() {
		return resolutionId;
	}

	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public User getResolvedBy() {
		return resolvedBy;
	}

	public void setResolvedBy(User resolvedBy) {
		this.resolvedBy = resolvedBy;
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

}
