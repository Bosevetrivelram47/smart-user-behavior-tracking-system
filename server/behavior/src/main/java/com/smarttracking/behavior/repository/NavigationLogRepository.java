package com.smarttracking.behavior.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.NavigationLog;

public interface NavigationLogRepository extends JpaRepository<NavigationLog, Long> {

}
