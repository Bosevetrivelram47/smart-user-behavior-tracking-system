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
@Table(name = "user_activity_logs")
public class UserActivityLog {

	// Auto incrementing id
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "log_id")
	private Long logId;

	// user refers to the user in the User Entity
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private String action;

	@Column(nullable = false)
	private String module;

	// DB will manage the loggedAt
	@Column(name = "logged_at", insertable = false, updatable = false)
	private LocalDateTime loggedAt;

	// Constructor For hibernate reflection
	protected UserActivityLog() {
	}

	// Parameterized Constructor
	public UserActivityLog(User user, String action, String module) {
		this.user = user;
		this.action = action;
		this.module = module;
	}

	// Getters and Setters
	public Long getLogId() {
		return logId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public LocalDateTime getLoggedAt() {
		return loggedAt;
	}

}
