package com.smarttracking.behavior.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarttracking.behavior.dto.user.UserRequestDto;
import com.smarttracking.behavior.dto.user.UserResponseDto;
import com.smarttracking.behavior.exception.UserNotFoundException;
import com.smarttracking.behavior.service.UserService;

import jakarta.validation.Valid;

@RestController
@Validated
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping
	public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody UserRequestDto dto) {
		UserResponseDto createdUser = userService.createUser(dto);

		return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) throws UserNotFoundException {
		return ResponseEntity.ok(userService.getUserById(id));
	}

	@GetMapping
	public ResponseEntity<List<UserResponseDto>> getAllUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}

	@GetMapping("/role/{role}")
	public ResponseEntity<List<UserResponseDto>> getUsersByRole(@PathVariable String role) {
		return ResponseEntity.ok(userService.getUsersByRole(role));
	}

	@PutMapping("/{id}/deactivate")
	public ResponseEntity<UserResponseDto> deactivateUser(@PathVariable Long id) throws UserNotFoundException {
		return ResponseEntity.ok(userService.deactivateUser(id));
	}

	@PutMapping("/{id}/activate")
	public ResponseEntity<UserResponseDto> activateUser(@PathVariable Long id) throws UserNotFoundException {
		return ResponseEntity.ok(userService.activateUser(id));
	}

	@GetMapping("/active")
	public ResponseEntity<List<UserResponseDto>> getActiveUsers() {
		return ResponseEntity.ok(userService.getAllActiveUsers());
	}

}
