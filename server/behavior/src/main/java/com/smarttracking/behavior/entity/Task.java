package com.smarttracking.behavior.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tasks")
public class Task {

	// Auto incrementing id
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "task_id")
	private Long taskId;

	@Column(nullable = false)
	private String title;

	@Column
	private String description;

	// LOW, MEDIUM, HIGH
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TaskPriority priority;

	// PENDING, IN_PROGRESS, COMPLETED
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TaskStatus status;

	// createdBy refers to the user in the User Entity
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by", nullable = false)
	private User createdBy;

	// DB will manage the createdAt
	@Column(name = "created_at", insertable = false, updatable = false)
	private LocalDateTime createdAt;

	// Constructor For hibernate reflection
	protected Task() {
	}

	// Parameterized Constructor
	public Task(String title, String description, TaskPriority priority, TaskStatus status, User createdBy) {
		this.title = title;
		this.description = description;
		this.priority = priority;
		this.status = status;
		this.createdBy = createdBy;
	}

	// Getters and Setters
	public Long getTaskId() {
		return taskId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public TaskPriority getPriority() {
		return priority;
	}

	public void setPriority(TaskPriority priority) {
		this.priority = priority;
	}

	public TaskStatus getStatus() {
		return status;
	}

	public void setStatus(TaskStatus status) {
		this.status = status;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

}
