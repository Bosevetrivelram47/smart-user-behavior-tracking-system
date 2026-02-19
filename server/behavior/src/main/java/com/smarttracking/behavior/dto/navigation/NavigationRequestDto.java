package com.smarttracking.behavior.dto.navigation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class NavigationRequestDto {

	@NotNull
	private Long userId;

	@NotBlank
	private String pageName;

	@NotNull
	private Integer timeSpentSeconds;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
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

}
