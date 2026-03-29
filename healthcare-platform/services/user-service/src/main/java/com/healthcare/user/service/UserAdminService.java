package com.healthcare.user.service;

import com.healthcare.user.domain.UserAccount;
import com.healthcare.user.repo.UserAccountRepository;
import com.healthcare.user.web.dto.UserAdminResponse;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserAdminService {

  private final UserAccountRepository users;

  public List<UserAdminResponse> listAll() {
    return users.findAll().stream()
        .map(
            u ->
                new UserAdminResponse(
                    u.getId(), u.getEmail(), u.getRole(), u.isActive(), u.getCreatedAt()))
        .toList();
  }

  @Transactional
  public UserAdminResponse setActive(UUID id, boolean active) {
    UserAccount u = users.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    if (u.getRole().name().equals("ADMIN")) {
      throw new IllegalArgumentException("Cannot deactivate ADMIN");
    }
    u.setActive(active);
    users.save(u);
    return new UserAdminResponse(
        u.getId(), u.getEmail(), u.getRole(), u.isActive(), u.getCreatedAt());
  }
}
