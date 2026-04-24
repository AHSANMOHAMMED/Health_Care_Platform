package com.mediconnect.authservice.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediconnect.authservice.dto.AuthResponse;
import com.mediconnect.authservice.dto.AuthTokens;
import com.mediconnect.authservice.dto.UserDTO;
import com.mediconnect.authservice.entity.UserCredentials;
import com.mediconnect.authservice.repository.UserRepository;
import com.mediconnect.authservice.service.EmailService;
import com.mediconnect.authservice.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
public class OAuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${oauth.google.client-id:}")
    private String googleClientId;

    @Value("${oauth.google.client-secret:}")
    private String googleClientSecret;

    @Value("${oauth.facebook.app-id:}")
    private String facebookAppId;

    @Value("${oauth.facebook.app-secret:}")
    private String facebookAppSecret;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    private static final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
    private static final String FACEBOOK_TOKEN_URL = "https://graph.facebook.com/v12.0/oauth/access_token";
    private static final String FACEBOOK_USER_INFO_URL = "https://graph.facebook.com/me";

    // ============================================================
    // GOOGLE OAUTH
    // ============================================================

    @GetMapping("/google")
    public void initiateGoogleOAuth(
            @RequestParam String role,
            @RequestParam(required = false) String redirect,
            HttpServletResponse response) throws IOException {

        if (googleClientId == null || googleClientId.isEmpty()) {
            log.error("Google OAuth not configured - missing client ID");
            sendOAuthError(response, "Google OAuth not configured. Please set GOOGLE_CLIENT_ID environment variable.");
            return;
        }

        String state = role + ":" + (redirect != null ? redirect : frontendUrl);
        String encodedState = URLEncoder.encode(state, StandardCharsets.UTF_8);

        String authorizationUri = UriComponentsBuilder
                .fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", googleClientId)
                .queryParam("redirect_uri", frontendUrl + "/oauth/google/callback")
                .queryParam("response_type", "code")
                .queryParam("scope", "openid email profile")
                .queryParam("state", encodedState)
                .queryParam("access_type", "offline")
                .build()
                .toUriString();

        response.sendRedirect(authorizationUri);
    }

    @GetMapping("/google/callback")
    public void handleGoogleCallback(
            @RequestParam String code,
            @RequestParam String state,
            HttpServletResponse response) throws IOException {

        String[] stateParts = state.split(":", 2);
        String role = stateParts[0];
        String redirectUrl = stateParts.length > 1 ? stateParts[1] : frontendUrl;

        try {
            // Exchange code for access token
            String tokenUrl = GOOGLE_TOKEN_URL +
                    "?client_id=" + googleClientId +
                    "&client_secret=" + googleClientSecret +
                    "&code=" + code +
                    "&grant_type=authorization_code" +
                    "&redirect_uri=" + URLEncoder.encode(frontendUrl + "/oauth/google/callback", StandardCharsets.UTF_8);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenUrl, null, Map.class);

            if (!tokenResponse.getStatusCode().is2xxSuccessful() || tokenResponse.getBody() == null) {
                sendOAuthError(response, "Failed to exchange authorization code");
                return;
            }

            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // Get user info from Google
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                    GOOGLE_USER_INFO_URL,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            if (!userInfoResponse.getStatusCode().is2xxSuccessful() || userInfoResponse.getBody() == null) {
                sendOAuthError(response, "Failed to get user info from Google");
                return;
            }

            Map<String, Object> userInfo = userInfoResponse.getBody();
            String email = (String) userInfo.get("email");
            String firstName = (String) userInfo.get("given_name");
            String lastName = (String) userInfo.get("family_name");
            Boolean emailVerified = (Boolean) userInfo.get("email_verified");

            // Process OAuth login/signup
            AuthResponse authResponse = processOAuthUser(email, firstName, lastName, role, emailVerified);

            // Send success message back to opener
            sendOAuthSuccess(response, authResponse, redirectUrl);

        } catch (Exception e) {
            log.error("Google OAuth error", e);
            sendOAuthError(response, "Authentication failed: " + e.getMessage());
        }
    }

    // ============================================================
    // FACEBOOK OAUTH
    // ============================================================

    @GetMapping("/facebook")
    public void initiateFacebookOAuth(
            @RequestParam String role,
            @RequestParam(required = false) String redirect,
            HttpServletResponse response) throws IOException {

        if (facebookAppId == null || facebookAppId.isEmpty()) {
            log.error("Facebook OAuth not configured - missing app ID");
            sendOAuthError(response, "Facebook OAuth not configured. Please set FACEBOOK_APP_ID environment variable.");
            return;
        }

        String state = role + ":" + (redirect != null ? redirect : frontendUrl);
        String encodedState = URLEncoder.encode(state, StandardCharsets.UTF_8);

        String authorizationUri = UriComponentsBuilder
                .fromUriString("https://www.facebook.com/v12.0/dialog/oauth")
                .queryParam("client_id", facebookAppId)
                .queryParam("redirect_uri", frontendUrl + "/oauth/facebook/callback")
                .queryParam("state", encodedState)
                .queryParam("scope", "email,public_profile")
                .build()
                .toUriString();

        response.sendRedirect(authorizationUri);
    }

    @GetMapping("/facebook/callback")
    public void handleFacebookCallback(
            @RequestParam String code,
            @RequestParam String state,
            HttpServletResponse response) throws IOException {

        String[] stateParts = state.split(":", 2);
        String role = stateParts[0];
        String redirectUrl = stateParts.length > 1 ? stateParts[1] : frontendUrl;

        try {
            // Exchange code for access token
            String tokenUrl = FACEBOOK_TOKEN_URL +
                    "?client_id=" + facebookAppId +
                    "&client_secret=" + facebookAppSecret +
                    "&code=" + code +
                    "&redirect_uri=" + URLEncoder.encode(frontendUrl + "/oauth/facebook/callback", StandardCharsets.UTF_8);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> tokenResponse = restTemplate.getForEntity(tokenUrl, Map.class);

            if (!tokenResponse.getStatusCode().is2xxSuccessful() || tokenResponse.getBody() == null) {
                sendOAuthError(response, "Failed to exchange authorization code");
                return;
            }

            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // Get user info from Facebook
            String userInfoUrl = FACEBOOK_USER_INFO_URL +
                    "?fields=id,name,first_name,last_name,email" +
                    "&access_token=" + accessToken;

            ResponseEntity<Map> userInfoResponse = restTemplate.getForEntity(userInfoUrl, Map.class);

            if (!userInfoResponse.getStatusCode().is2xxSuccessful() || userInfoResponse.getBody() == null) {
                sendOAuthError(response, "Failed to get user info from Facebook");
                return;
            }

            Map<String, Object> userInfo = userInfoResponse.getBody();
            String email = (String) userInfo.get("email");
            String firstName = (String) userInfo.get("first_name");
            String lastName = (String) userInfo.get("last_name");

            if (email == null) {
                sendOAuthError(response, "Email not provided by Facebook. Please use email login.");
                return;
            }

            // Process OAuth login/signup
            AuthResponse authResponse = processOAuthUser(email, firstName, lastName, role, true);

            // Send success message back to opener
            sendOAuthSuccess(response, authResponse, redirectUrl);

        } catch (Exception e) {
            log.error("Facebook OAuth error", e);
            sendOAuthError(response, "Authentication failed: " + e.getMessage());
        }
    }

    // ============================================================
    // APPLE OAUTH (Simplified - requires Apple Developer account)
    // ============================================================

    @GetMapping("/apple")
    public void initiateAppleOAuth(
            @RequestParam String role,
            @RequestParam(required = false) String redirect,
            HttpServletResponse response) throws IOException {

        // Apple OAuth requires Apple Developer Program membership ($99/year)
        // and more complex implementation with JWT client secret generation
        // This is a placeholder that shows proper error message

        log.warn("Apple OAuth requested but not fully implemented - requires Apple Developer Program");
        sendOAuthError(response, "Apple Sign In requires Apple Developer Program membership. Please use Google, Facebook, or email login.");
    }

    // ============================================================
    // COMMON OAUTH PROCESSING
    // ============================================================

    private AuthResponse processOAuthUser(String email, String firstName, String lastName, String role, Boolean emailVerified) {
        Optional<UserCredentials> existingUser = userRepository.findByEmail(email);

        UserCredentials user;
        boolean isNewUser = false;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update name if not set
            if (user.getFirstName() == null || user.getFirstName().isEmpty()) {
                user.setFirstName(firstName);
            }
            if (user.getLastName() == null || user.getLastName().isEmpty()) {
                user.setLastName(lastName);
            }
            userRepository.save(user);
        } else {
            // Create new user
            isNewUser = true;
            user = new UserCredentials();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random password
            user.setRole(role.toUpperCase());
            user.setFirstName(firstName);
            user.setLastName(lastName);

            // Doctors need approval, patients are auto-approved
            if ("DOCTOR".equalsIgnoreCase(role)) {
                user.setStatus("PENDING");
            } else {
                user.setStatus("APPROVED");
            }

            userRepository.save(user);
        }

        // Send welcome email for new users
        if (isNewUser) {
            try {
                emailService.sendSimpleEmail(
                        email,
                        "Welcome to MediConnect Lanka",
                        "Hi " + firstName + ",\n\nYour account has been created using " + (emailVerified != null && emailVerified ? "Google" : "social") + " login.\n\nYou can now access all features of MediConnect Lanka.\n\nBest regards,\nMediConnect Lanka Team"
                );
            } catch (Exception e) {
                log.warn("Failed to send welcome email", e);
            }
        }

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole());

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

        return AuthResponse.builder()
                .tokens(tokens)
                .user(userDto)
                .message(isNewUser ? "Account created successfully" : "Welcome back!")
                .build();
    }

    private void sendOAuthSuccess(HttpServletResponse response, AuthResponse authResponse, String redirectUrl) throws IOException {
        response.setContentType("text/html");
        response.getWriter().write("""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Successful</title>
                <style>
                    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #0C1220; }
                    .container { text-align: center; color: white; }
                    .success { color: #10B981; font-size: 48px; margin-bottom: 20px; }
                    .message { font-size: 18px; margin-bottom: 10px; }
                    .submessage { color: #94A3B8; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success">✓</div>
                    <div class="message">Authentication Successful</div>
                    <div class="submessage">Closing window and redirecting...</div>
                </div>
                <script>
                    window.opener.postMessage({
                        type: 'OAUTH_SUCCESS',
                        payload: %s
                    }, '%s');
                    setTimeout(() => window.close(), 1000);
                </script>
            </body>
            </html>
            """.formatted(
                objectMapper.writeValueAsString(authResponse),
                redirectUrl
        ));
    }

    private void sendOAuthError(HttpServletResponse response, String errorMessage) throws IOException {
        response.setContentType("text/html");
        response.getWriter().write("""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Failed</title>
                <style>
                    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #0C1220; }
                    .container { text-align: center; color: white; max-width: 400px; padding: 20px; }
                    .error { color: #EF4444; font-size: 48px; margin-bottom: 20px; }
                    .message { font-size: 18px; margin-bottom: 10px; }
                    .submessage { color: #94A3B8; font-size: 14px; margin-bottom: 20px; }
                    .close-btn { background: #0EA5E9; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="error">✗</div>
                    <div class="message">Authentication Failed</div>
                    <div class="submessage">%s</div>
                    <button class="close-btn" onclick="window.close()">Close Window</button>
                </div>
                <script>
                    window.opener.postMessage({
                        type: 'OAUTH_ERROR',
                        payload: { message: '%s' }
                    }, '*');
                </script>
            </body>
            </html>
            """.formatted(errorMessage, errorMessage.replace("'", "\\'")));
    }
}
