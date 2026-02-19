package com.smarttracking.behavior.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.NavigationLog;

public interface NavigationLogRepository extends JpaRepository<NavigationLog, Long> {
	public List<NavigationLog> findByUser_UserId(Long userId);
}
