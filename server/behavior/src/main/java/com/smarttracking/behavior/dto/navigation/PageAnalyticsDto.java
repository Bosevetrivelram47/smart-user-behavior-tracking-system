package com.smarttracking.behavior.dto.navigation;

public class PageAnalyticsDto {

	private String pageName;
	private Long visitCount;

	public String getPageName() {
		return pageName;
	}

	public void setPageName(String pageName) {
		this.pageName = pageName;
	}

	public Long getVisitCount() {
		return visitCount;
	}

	public void setVisitCount(Long visitCount) {
		this.visitCount = visitCount;
	}

}
