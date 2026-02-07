package com.smarttracking.behavior.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarttracking.behavior.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
