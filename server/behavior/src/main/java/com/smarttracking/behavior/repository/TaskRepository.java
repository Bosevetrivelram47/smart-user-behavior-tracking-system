package com.smarttracking.behavior.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

}
