package com.smarttracking.behavior.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.TaskResolution;

public interface TaskResolutionRepository extends JpaRepository<TaskResolution, Long> {
	public List<TaskResolution> findAllByTask_TaskId(Long taskId);
}
