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
@Table(name = "task_assignments")
public class TaskAssignment {

	// Auto incrementing id
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "assignment_id")
	private Long assignmentId;

	// task refers to the tasks in the Task Entity
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "task_id", nullable = false)
	private Task task;

	// assignedTo refers to the user in the User Entity
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assigned_to", nullable = false)
	private User assignedTo;

	// assignedBy refers to the user in the User Entity
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assigned_by", nullable = false)
	private User assignedBy;

	// DB will manage the assignedAt
	@Column(name = "assigned_at", insertable = false, updatable = false)
	private LocalDateTime assignedAt;

	// Constructor For hibernate reflection
	protected TaskAssignment() {
	}

	// Parameterized Constructor
	public TaskAssignment(Task task, User assignedTo, User assignedBy) {
		this.task = task;
		this.assignedTo = assignedTo;
		this.assignedBy = assignedBy;
	}

	// Getters and Setters
	public Long getAssignmentId() {
		return assignmentId;
	}

	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public User getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(User assignedTo) {
		this.assignedTo = assignedTo;
	}

	public User getAssignedBy() {
		return assignedBy;
	}

	public void setAssignedBy(User assignedBy) {
		this.assignedBy = assignedBy;
	}

	public LocalDateTime getAssignedAt() {
		return assignedAt;
	}

}
