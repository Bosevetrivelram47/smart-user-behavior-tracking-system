package com.smarttracking.behavior.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.UserActivityLog;

public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, Long> {

}
