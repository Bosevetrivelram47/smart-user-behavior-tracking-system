package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.entity.User;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.repository.UserRepository;

@Service
public class UserService {

	// Dependency Injection
	private final UserRepository userRepository;
	private final UserActivityLogService userActivityLogService;

	public UserService(UserRepository userRepository, UserActivityLogService userActivityLogService) {
		this.userRepository = userRepository;
		this.userActivityLogService = userActivityLogService;
	}

	// Creating new User
	public User createUser(User user) {
		User savedUser = userRepository.save(user);

		userActivityLogService.logActivity(savedUser, "CREATE_USER", "USER");

		return savedUser;

	}

	// Getting the users by role
	public List<User> getUsersByRole(String role) {
		return userRepository.findAllByRole(role);
	}

	// Getting particular user
	public User getUserById(Long userId) throws UserNotFoundException {
		return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
	}

	// Getting all users
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	// Activate the user
	public User activateUser(Long userId) throws UserNotFoundException {
		User user = getUserById(userId);
		user.setIsActive(true);
		userActivityLogService.logActivity(user, "ACTIVATE_USER", "USER");

		return userRepository.save(user);
	}

	// Deactivate the user
	public User deactivateUser(Long userId) throws UserNotFoundException {
		User user = getUserById(userId);
		user.setIsActive(false);
		userActivityLogService.logActivity(user, "DEACTIVATE_USER", "USER");

		return userRepository.save(user);
	}

	// Check for the user exists or not
	public boolean isUserExists(Long userId) {
		return userRepository.existsById(userId);
	}

	// Getting all active users
	public List<User> getAllActiveUsers() {
		return userRepository.findAllByIsActiveTrue();
	}

}
