package com.smarttracking.behavior.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.TaskResolution;

public interface TaskResolutionRepository extends JpaRepository<TaskResolution, Long> {

}
