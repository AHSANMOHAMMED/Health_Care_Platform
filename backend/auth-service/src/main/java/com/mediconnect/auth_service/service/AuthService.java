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
