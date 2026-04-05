import os

BASE_DIR = "backend/auth-service/src/main/java/com/mediconnect/auth_service"
RES_DIR = "backend/auth-service/src/main/resources"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + "\n")

# application.yml
write_file(f"{RES_DIR}/application.yml", """
server:
  port: 8081

spring:
  application:
    name: auth-service
  config:
    import: "optional:configserver:http://localhost:8888/"
  datasource:
    url: jdbc:postgresql://localhost:5432/auth_db
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

# Flyway config
  flyway:
    enabled: false # Disabling for native dev simplicity, using ddl-auto update
""")

# Role.java
write_file(f"{BASE_DIR}/entity/Role.java", """
package com.mediconnect.auth_service.entity;
public enum Role { PATIENT, DOCTOR, ADMIN }
""")

# User.java
write_file(f"{BASE_DIR}/entity/User.java", """
package com.mediconnect.auth_service.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    private boolean isApproved; // For doctors
}
""")

# UserRepository.java
write_file(f"{BASE_DIR}/repository/UserRepository.java", """
package com.mediconnect.auth_service.repository;
import com.mediconnect.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
""")

# DTOs
write_file(f"{BASE_DIR}/dto/AuthRequest.java", """
package com.mediconnect.auth_service.dto;
import lombok.Data;
@Data
public class AuthRequest {
    private String email;
    private String password;
}
""")

write_file(f"{BASE_DIR}/dto/RegisterRequest.java", """
package com.mediconnect.auth_service.dto;
import lombok.Data;
import com.mediconnect.auth_service.entity.Role;
@Data
public class RegisterRequest {
    private String email;
    private String password;
    private Role role;
}
""")

write_file(f"{BASE_DIR}/dto/AuthResponse.java", """
package com.mediconnect.auth_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import com.mediconnect.auth_service.entity.Role;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private Role role;
}
""")

# JwtUtil.java
write_file(f"{BASE_DIR}/security/JwtUtil.java", """
package com.mediconnect.auth_service.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret:8e9df6466f8acabdc21c27cc84310d54026f8d38645fb8bfa923ba3ac425abf1}")
    private String secret;
    @Value("${jwt.expiration:86400000}")
    private long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, String role, Long userId) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public void validateToken(final String token) {
        Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
    }
}
""")

# SecurityConfig.java
write_file(f"{BASE_DIR}/security/SecurityConfig.java", """
package com.mediconnect.auth_service.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf().disable()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .build();
    }
}
""")

# AuthService.java
write_file(f"{BASE_DIR}/service/AuthService.java", """
package com.mediconnect.auth_service.service;

import com.mediconnect.auth_service.dto.AuthRequest;
import com.mediconnect.auth_service.dto.AuthResponse;
import com.mediconnect.auth_service.dto.RegisterRequest;
import com.mediconnect.auth_service.entity.User;
import com.mediconnect.auth_service.repository.UserRepository;
import com.mediconnect.auth_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isApproved(request.getRole() != com.mediconnect.auth_service.entity.Role.DOCTOR) // Doctors need approval
                .build();
        userRepository.save(user);
        return "User registered successfully";
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
                
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.isApproved()) {
            throw new RuntimeException("Account pending admin approval");
        }
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponse(token, user.getId(), user.getRole());
    }

    public void validateToken(String token) {
        jwtUtil.validateToken(token);
    }
}
""")

# AuthController.java
write_file(f"{BASE_DIR}/controller/AuthController.java", """
package com.mediconnect.auth_service.controller;

import com.mediconnect.auth_service.dto.AuthRequest;
import com.mediconnect.auth_service.dto.AuthResponse;
import com.mediconnect.auth_service.dto.RegisterRequest;
import com.mediconnect.auth_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestParam("token") String token) {
        authService.validateToken(token);
        return ResponseEntity.ok("Token is valid");
    }
}
""")

# Main class
write_file(f"{BASE_DIR}/AuthServiceApplication.java", """
package com.mediconnect.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}
}
""")

print("Auth Service code generated successfully!")
