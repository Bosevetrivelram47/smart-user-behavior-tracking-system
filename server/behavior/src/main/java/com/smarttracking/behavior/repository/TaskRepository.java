package com.smarttracking.behavior.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.Task;
import com.smarttracking.behavior.entity.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, Long> {
	public List<Task> findAllByCreatedBy_UserId(Long userId);

	public List<Task> findAllByStatus(TaskStatus status);
}
