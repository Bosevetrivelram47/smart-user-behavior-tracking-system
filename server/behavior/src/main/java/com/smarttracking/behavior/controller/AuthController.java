package com.smarttracking.behavior.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarttracking.behavior.dto.auth.LoginRequestDto;
import com.smarttracking.behavior.dto.auth.LoginResponseDto;
import com.smarttracking.behavior.exception.WrongPasswordException;
import com.smarttracking.behavior.service.UserAuthService;

@RestController
@Validated
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/auth")
public class AuthController {
	private final UserAuthService authService;

	public AuthController(UserAuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto dto) throws WrongPasswordException {
		return ResponseEntity.ok(authService.login(dto));
	}

}
