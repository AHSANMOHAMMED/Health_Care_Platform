package com.mediconnect.authservice.controller;

import com.mediconnect.authservice.dto.AuthRequest;
import com.mediconnect.authservice.dto.AuthResponse;
import com.mediconnect.authservice.dto.AuthTokens;
import com.mediconnect.authservice.dto.RegisterRequest;
import com.mediconnect.authservice.dto.UserDTO;
import com.mediconnect.authservice.entity.UserCredentials;
import com.mediconnect.authservice.repository.UserRepository;
import com.mediconnect.authservice.service.JwtService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        UserCredentials user = new UserCredentials();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole().toUpperCase() : "PATIENT");
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        // Doctors start as PENDING, others as APPROVED
        if ("DOCTOR".equalsIgnoreCase(user.getRole())) {
            user.setStatus("PENDING");
        } else {
            user.setStatus("APPROVED");
        }
        
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        if (authenticate.isAuthenticated()) {
            UserCredentials user = userRepository.findByEmail(request.getEmail()).get();
            
            if (!"APPROVED".equalsIgnoreCase(user.getStatus())) {
                return ResponseEntity.status(403).body(AuthResponse.builder()
                    .message("Account is pending approval by administrator")
                    .build());
            }

            String token = jwtService.generateToken(request.getEmail(), user.getId(), user.getRole());
            
            AuthTokens tokens = AuthTokens.builder()
                .accessToken(token)
                .refreshToken(token) // Simplified for now, can be improved with actual refresh logic
                .build();
                
            UserDTO userDto = UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();

            return ResponseEntity.ok(AuthResponse.builder()
                .tokens(tokens)
                .user(userDto)
                .build());
        } else {
            throw new RuntimeException("invalid access");
        }
    }

    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        jwtService.validateToken(token);
        return "Token is valid";
    }

    // ── ADMIN ENDPOINTS ──────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<java.util.List<UserCredentials>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<String> updateUserStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> statusMap) {
        if (id == null) return ResponseEntity.badRequest().body("ID cannot be null");
        String status = statusMap.get("status");
        java.util.Optional<UserCredentials> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            UserCredentials user = userOpt.get();
            user.setStatus(status.toUpperCase());
            userRepository.save(user);
            
            // Publish Notification Event
            if ("DOCTOR".equalsIgnoreCase(user.getRole())) {
                Map<String, Object> event = new HashMap<>();
                event.put("type", "APPROVED".equalsIgnoreCase(status) ? "DOCTOR_APPROVED" : "DOCTOR_REJECTED");
                event.put("email", user.getEmail());
                event.put("firstName", user.getFirstName());
                event.put("lastName", user.getLastName());
                
                try {
                    rabbitTemplate.convertAndSend("notification_queue", objectMapper.writeValueAsString(event));
                } catch (Exception e) {
                    // Log error but don't fail the request
                }
            }
            
            return ResponseEntity.ok("User status updated to " + status);
        }
        return ResponseEntity.notFound().build();
    }
}
