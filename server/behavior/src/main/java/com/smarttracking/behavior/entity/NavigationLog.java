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
@Table(name = "navigation_logs")
public class NavigationLog {

	// Auto incrementing id
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "navigation_id")
	private Long navigationId;

	// user refers to the user in the User Entity
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "page_name", nullable = false)
	private String pageName;

	@Column(name = "time_spent_seconds")
	private Integer timeSpentSeconds;

	// DB will manage the visitedAt
	@Column(name = "visited_at", insertable = false, updatable = false)
	private LocalDateTime visitedAt;

	// Constructor For hibernate reflection
	protected NavigationLog() {
	}

	// Parameterized Constructor
	public NavigationLog(User user, String pageName, Integer timeSpentSeconds) {
		this.user = user;
		this.pageName = pageName;
		this.timeSpentSeconds = timeSpentSeconds;
	}

	// Getters and Setters
	public Long getNavigationId() {
		return navigationId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getPageName() {
		return pageName;
	}

	public void setPageName(String pageName) {
		this.pageName = pageName;
	}

	public Integer getTimeSpentSeconds() {
		return timeSpentSeconds;
	}

	public void setTimeSpentSecond(Integer timeSpentSecond) {
		this.timeSpentSeconds = timeSpentSecond;
	}

	public LocalDateTime getVisitedAt() {
		return visitedAt;
	}

}
