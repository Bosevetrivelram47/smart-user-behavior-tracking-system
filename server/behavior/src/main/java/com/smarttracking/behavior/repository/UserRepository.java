package com.smarttracking.behavior.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	public List<User> findAllByRole(String role);

	public User activateUser(Long userId);

	public User deactivateUser(Long userId);

	public List<User> findAllByIsActiveTrue();
}
