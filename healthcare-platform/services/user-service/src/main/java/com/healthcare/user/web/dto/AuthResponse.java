package com.healthcare.user.web.dto;

import com.healthcare.user.domain.Role;
import java.util.UUID;

public record AuthResponse(
    String accessToken, UserSummary user) {

  public record UserSummary(UUID id, String email, Role role) {}
}
