package com.mediconnect.authservice.controller;

import com.mediconnect.authservice.dto.AuthRequest;
import com.mediconnect.authservice.dto.AuthResponse;
import com.mediconnect.authservice.dto.AuthTokens;
import com.mediconnect.authservice.dto.RegisterRequest;
import com.mediconnect.authservice.dto.UserDTO;
import com.mediconnect.authservice.entity.PasswordResetToken;
import com.mediconnect.authservice.entity.UserCredentials;
import com.mediconnect.authservice.entity.VerificationToken;
import com.mediconnect.authservice.repository.PasswordResetTokenRepository;
import com.mediconnect.authservice.repository.UserRepository;
import com.mediconnect.authservice.repository.VerificationTokenRepository;
import com.mediconnect.authservice.service.EmailService;
import com.mediconnect.authservice.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
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

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    // ============================================================
    // REGISTRATION & EMAIL VERIFICATION
    // ============================================================

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        
        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Registration failed: Email {} already exists", request.getEmail());
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        
        try {
            UserCredentials user = new UserCredentials();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole() != null ? request.getRole().toUpperCase() : "PATIENT");
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());

            // For demonstration purposes, auto-approve and auto-verify all users
            user.setStatus("APPROVED");
            user.setEmailVerified(true);

            userRepository.save(user);
            log.info("User registered successfully: {}", user.getEmail());

            // Create verification token and send email
            try {
                String token = UUID.randomUUID().toString();
                VerificationToken verificationToken = VerificationToken.builder()
                        .token(token)
                        .user(user)
                        .expiryDate(LocalDateTime.now().plusHours(24))
                        .build();
                verificationTokenRepository.save(verificationToken);

                emailService.sendVerificationEmail(user.getEmail(), token, user.getFirstName());
                log.info("Verification email sent to: {}", user.getEmail());
            } catch (Exception e) {
                log.error("Failed to send verification email for user: {}", user.getEmail(), e);
                // Don't fail registration if email fails, user can resend
            }

            return ResponseEntity.ok(Map.of(
                "message", "Registration successful. You can now log in.",
                "requiresVerification", "false"
            ));
        } catch (Exception e) {
            log.error("Critical error during registration for email: {}", request.getEmail(), e);
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error during registration: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        log.info("Received login request for email: {}", request.getEmail());
        try {
            Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            if (authenticate.isAuthenticated()) {
                UserCredentials user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));
                
                log.info("User {} authenticated successfully with role {}", user.getEmail(), user.getRole());

                if (!"APPROVED".equalsIgnoreCase(user.getStatus())) {
                    log.warn("Login blocked: Account {} is {}", user.getEmail(), user.getStatus());
                    return ResponseEntity.status(403).body(AuthResponse.builder()
                        .message("Account is pending approval by administrator")
                        .build());
                }

                // Check if email is verified
                if (user.getEmailVerified() != null && !user.getEmailVerified()) {
                    log.warn("Login blocked: Email {} is not verified", user.getEmail());
                    return ResponseEntity.status(403).body(AuthResponse.builder()
                        .message("Please verify your email before logging in.")
                        .build());
                }

                String token = jwtService.generateToken(request.getEmail(), user.getId(), user.getRole());

                AuthTokens tokens = AuthTokens.builder()
                    .accessToken(token)
                    .refreshToken(token)
                    .build();

                UserDTO userDto = UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .build();

                log.info("Generated JWT for user: {}", user.getEmail());
                return ResponseEntity.ok(AuthResponse.builder()
                    .tokens(tokens)
                    .user(userDto)
                    .build());
            } else {
                log.warn("Authentication failed for email: {}", request.getEmail());
                return ResponseEntity.status(401).body(AuthResponse.builder()
                    .message("Invalid email or password")
                    .build());
            }
        } catch (org.springframework.security.core.AuthenticationException e) {
            log.warn("Authentication failed for email: {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(401).body(AuthResponse.builder()
                .message("Invalid email or password")
                .build());
        } catch (Exception e) {
            log.error("Critical error during login for email: {}", request.getEmail(), e);
            return ResponseEntity.status(500).body(AuthResponse.builder()
                .message("Internal server error: " + e.getMessage())
                .build());
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam("token") String token) {
        Optional<VerificationToken> tokenOpt = verificationTokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid verification token"));
        }

        VerificationToken verificationToken = tokenOpt.get();

        if (verificationToken.isExpired()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Verification token has expired. Please request a new one."));
        }

        if (verificationToken.isUsed()) {
            return ResponseEntity.badRequest().body(Map.of("message", "This verification link has already been used."));
        }

        UserCredentials user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);

        return ResponseEntity.ok(Map.of("message", "Email verified successfully! You can now log in."));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, String>> resendVerificationEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<UserCredentials> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "No account found with this email"));
        }

        UserCredentials user = userOpt.get();

        if (user.getEmailVerified() != null && user.getEmailVerified()) {
            return ResponseEntity.badRequest().body(Map.of("message", "This email is already verified"));
        }

        // Delete old tokens
        verificationTokenRepository.deleteByUserId(user.getId());

        // Create new token
        try {
            String token = UUID.randomUUID().toString();
            VerificationToken verificationToken = VerificationToken.builder()
                    .token(token)
                    .user(user)
                    .expiryDate(LocalDateTime.now().plusHours(24))
                    .build();
            verificationTokenRepository.save(verificationToken);

            emailService.sendVerificationEmail(user.getEmail(), token, user.getFirstName());
            log.info("Verification email resent to: {}", user.getEmail());

            return ResponseEntity.ok(Map.of("message", "Verification email sent. Please check your inbox."));
        } catch (Exception e) {
            log.error("Failed to resend verification email", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to send email. Please try again later."));
        }
    }

    // ============================================================
    // PASSWORD RESET
    // ============================================================

    @PostMapping("/request-password-reset")
    public ResponseEntity<Map<String, String>> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<UserCredentials> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            // Return same message for security (don't reveal if email exists)
            return ResponseEntity.ok(Map.of("message", "If an account exists with this email, you will receive password reset instructions."));
        }

        UserCredentials user = userOpt.get();

        // Delete old tokens
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Create new reset token
        try {
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiryDate(LocalDateTime.now().plusHours(1))
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(resetToken);

            emailService.sendPasswordResetEmail(user.getEmail(), token, user.getFirstName());
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to send email. Please try again later."));
        }

        return ResponseEntity.ok(Map.of("message", "If an account exists with this email, you will receive password reset instructions."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (newPassword == null || newPassword.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 8 characters"));
        }

        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid reset token"));
        }

        PasswordResetToken resetToken = tokenOpt.get();

        if (resetToken.isExpired()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Reset token has expired. Please request a new one."));
        }

        if (resetToken.isUsed()) {
            return ResponseEntity.badRequest().body(Map.of("message", "This reset link has already been used."));
        }

        UserCredentials user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Invalidate all existing sessions by clearing tokens
        verificationTokenRepository.deleteByUserId(user.getId());

        return ResponseEntity.ok(Map.of("message", "Password reset successful! You can now log in with your new password."));
    }

    // ============================================================
    // TOKEN VALIDATION
    // ============================================================

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
