package com.smarttracking.behavior.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttracking.behavior.dto.user.UserRequestDto;
import com.smarttracking.behavior.dto.user.UserResponseDto;
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

	// DTO response
	public UserResponseDto mapToResponse(User user) {
		UserResponseDto dto = new UserResponseDto();

		dto.setUserId(user.getUserId());
		dto.setName(user.getName());
		dto.setEmail(user.getEmail());
		dto.setRole(user.getRole());
		dto.setActive(user.getIsActive());

		return dto;
	}

	// Creating new User
	public UserResponseDto createUser(UserRequestDto dto) {
		User user = new User(dto.getName(), dto.getEmail(), dto.getPassword(), dto.getRole());

		User savedUser = userRepository.save(user);

		userActivityLogService.logActivity(savedUser, "CREATE_USER", "USER");

		return mapToResponse(savedUser);

	}

	// Getting the users by role
	public List<UserResponseDto> getUsersByRole(String role) {
		return userRepository.findAllByRole(role).stream().map(this::mapToResponse).toList();
	}

	// Getting particular user
	public UserResponseDto getUserById(Long userId) throws UserNotFoundException {
		User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
		return mapToResponse(user);
	}

	// For other internal services
	public User getUserEntityById(Long userId) throws UserNotFoundException {
		return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
	}

	// Getting all users
	public List<UserResponseDto> getAllUsers() {
		return userRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	// Activate the user
	public UserResponseDto activateUser(Long userId) throws UserNotFoundException {
		User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
		user.setIsActive(true);
		userActivityLogService.logActivity(user, "ACTIVATE_USER", "USER");

		return mapToResponse(userRepository.save(user));
	}

	// Deactivate the user
	public UserResponseDto deactivateUser(Long userId) throws UserNotFoundException {
		User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
		user.setIsActive(false);
		userActivityLogService.logActivity(user, "DEACTIVATE_USER", "USER");

		return mapToResponse(userRepository.save(user));
	}

	// Check for the user exists or not
	public boolean isUserExists(Long userId) {
		return userRepository.existsById(userId);
	}

	// Getting all active users
	public List<UserResponseDto> getAllActiveUsers() {
		return userRepository.findAllByIsActiveTrue().stream().map(this::mapToResponse).toList();
	}

}
