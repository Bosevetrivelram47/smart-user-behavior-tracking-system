package com.smarttracking.behavior.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.smarttracking.behavior.entity.User;
import com.smarttracking.behavior.repository.UserAuthRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
	private final UserAuthRepository authRepository;

	public CustomUserDetailsService(UserAuthRepository authRepository) {
		this.authRepository = authRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String email) {
		User user = authRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not Found"));

		return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
				List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));

	}

}
