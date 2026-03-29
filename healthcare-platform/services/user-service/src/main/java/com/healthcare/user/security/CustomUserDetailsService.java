package com.healthcare.user.security;

import com.healthcare.user.domain.UserAccount;
import com.healthcare.user.repo.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final UserAccountRepository users;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    UserAccount u =
        users.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return new AccountPrincipal(
        u.getId(), u.getEmail(), u.getPasswordHash(), u.getRole(), u.isActive());
  }
}
