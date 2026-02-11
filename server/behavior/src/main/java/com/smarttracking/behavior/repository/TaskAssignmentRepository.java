package com.smarttracking.behavior.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.TaskAssignment;

public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
	public boolean existsByTask_TaskIdAndAssignedTo_UserId(Long taskId, Long assignedToUserId);

	public List<TaskAssignment> findAllByAssignedTo_UserId(Long userId);

	public List<TaskAssignment> findAllByTask_TaskId(Long userId);
}
