package com.smarttracking.behavior.security;

import java.security.Key;
import java.time.Duration;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	// Encrption Key
	@Value("${jwt.secret}")
	private String SECRET;

	// Expiration time
	@Value("${jwt.expiration}")
	private Duration EXPIRATION;

	private Key getSigningKey() {
		return Keys.hmacShaKeyFor(SECRET.getBytes());
	}

	// Token Generation
	public String generateToken(String email, String role) {
		return Jwts.builder().setSubject(email).claim("role", role).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION.toMillis()))
				.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
	}

	// Extract email from token
	public String extractEmail(String token) {
		return extractClaims(token).getSubject();
	}

	// Extract role from token
	public String extractRole(String token) {
		return extractClaims(token).get("role", String.class);
	}

	// Check is the token is valid or not
	public boolean validateToken(String token, String email) {
		try {
			String extractedEmail = extractEmail(token);
			return extractedEmail.equals(email) && !isTokenExpired(token);
		} catch (Exception ex) {
			return false;
		}

	}

	// Check is the token is expired or not
	public boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	// Extract the expiration date for token
	public Date extractExpiration(String token) {
		return extractClaims(token).getExpiration();
	}

	// Extract claims from token
	private Claims extractClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
	}
}
