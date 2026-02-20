package com.smarttracking.behavior.dto.navigation;

import java.time.LocalDateTime;

public class NavigationLogResponseDto {

	private Long navigationId;
	private Long userId;
	private String userName;
	private String pageName;
	private Integer timeSpentSeconds;
	private LocalDateTime visitedAt;

	public Long getNavigationId() {
		return navigationId;
	}

	public void setNavigationId(Long navigationId) {
		this.navigationId = navigationId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
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

	public void setTimeSpentSeconds(Integer timeSpentSeconds) {
		this.timeSpentSeconds = timeSpentSeconds;
	}

	public LocalDateTime getVisitedAt() {
		return visitedAt;
	}

	public void setVisitedAt(LocalDateTime visitedAt) {
		this.visitedAt = visitedAt;
	}

}
