package com.smarttracking.behavior.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.User;

public interface UserAuthRepository extends JpaRepository<User, Long> {
	public Optional<User> findByEmail(String email);
}
