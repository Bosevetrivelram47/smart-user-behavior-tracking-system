package com.smarttracking.behavior.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.smarttracking.behavior.dto.auth.LoginRequestDto;
import com.smarttracking.behavior.dto.auth.LoginResponseDto;
import com.smarttracking.behavior.entity.User;
import com.smarttracking.behavior.exception.WrongPasswordException;
import com.smarttracking.behavior.repository.UserAuthRepository;
import com.smarttracking.behavior.security.JwtUtil;

@Service
public class UserAuthService {
	private final UserAuthRepository authRepository;
	private final JwtUtil jwtUtil;
	private final AuthenticationManager authManager;

	public UserAuthService(UserAuthRepository authRepository, JwtUtil jwtUtil, AuthenticationManager authManager) {
		this.authRepository = authRepository;
		this.jwtUtil = jwtUtil;
		this.authManager = authManager;
	}

	public User getUserForAuthentication(String email) {
		return authRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}

	public LoginResponseDto login(LoginRequestDto dto) throws WrongPasswordException {
		try {
			authManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
		} catch (BadCredentialsException ex) {
			throw new WrongPasswordException("Invalid email or password");
		}

		User user = authRepository.findByEmail(dto.getEmail()).orElseThrow();

		String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

		return new LoginResponseDto(token, user.getUserId(), user.getName(), user.getEmail(), user.getRole());
	}

}
