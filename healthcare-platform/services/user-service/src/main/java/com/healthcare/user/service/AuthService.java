package com.healthcare.user.service;

import com.healthcare.user.domain.Role;
import com.healthcare.user.domain.UserAccount;
import com.healthcare.user.repo.UserAccountRepository;
import com.healthcare.user.security.AccountPrincipal;
import com.healthcare.user.security.JwtTokenProvider;
import com.healthcare.user.web.dto.AuthResponse;
import com.healthcare.user.web.dto.LoginRequest;
import com.healthcare.user.web.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserAccountRepository users;
  private final PasswordEncoder encoder;
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwt;

  @Transactional
  public AuthResponse register(RegisterRequest req) {
    if (req.role() == Role.ADMIN) {
      throw new IllegalArgumentException("Cannot self-register as ADMIN");
    }
    if (users.findByEmail(req.email()).isPresent()) {
      throw new IllegalArgumentException("Email already registered");
    }
    UserAccount u =
        UserAccount.builder()
            .email(req.email())
            .passwordHash(encoder.encode(req.password()))
            .role(req.role())
            .active(true)
            .build();
    users.save(u);
    String token = jwt.createToken(u.getId(), u.getEmail(), u.getRole());
    return new AuthResponse(
        token, new AuthResponse.UserSummary(u.getId(), u.getEmail(), u.getRole()));
  }


  public AuthResponse login(LoginRequest req) {
    Authentication auth =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email(), req.password()));
    AccountPrincipal p = (AccountPrincipal) auth.getPrincipal();
    UserAccount u =
        users.findById(p.getId()).orElseThrow(() -> new IllegalArgumentException("User missing"));
    String token = jwt.createToken(u.getId(), u.getEmail(), u.getRole());
    return new AuthResponse(
        token, new AuthResponse.UserSummary(u.getId(), u.getEmail(), u.getRole()));
  }
}
