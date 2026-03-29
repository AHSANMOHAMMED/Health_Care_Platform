package com.healthcare.user.web.dto;

import com.healthcare.user.domain.Role;
import java.time.Instant;
import java.util.UUID;

public record UserAdminResponse(
    UUID id, String email, Role role, boolean active, Instant createdAt) {}
