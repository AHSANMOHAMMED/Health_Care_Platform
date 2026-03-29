package com.healthcare.user.config;

import com.healthcare.user.domain.Role;
import com.healthcare.user.domain.UserAccount;
import com.healthcare.user.repo.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

  private final UserAccountRepository users;
  private final PasswordEncoder encoder;

  @Bean
  CommandLineRunner seedAdmin() {
    return args -> {
      String email = "admin@healthcare.local";
      if (users.findByEmail(email).isEmpty()) {
        users.save(
            UserAccount.builder()
                .email(email)
                .passwordHash(encoder.encode("Admin#12345"))
                .role(Role.ADMIN)
                .active(true)
                .build());
      }
    };
  }
}
