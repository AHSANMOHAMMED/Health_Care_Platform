package com.healthcare.user.web;

import com.healthcare.user.service.UserAdminService;
import com.healthcare.user.web.dto.UserAdminResponse;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserAdminController {

  private final UserAdminService userAdminService;

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public List<UserAdminResponse> list() {
    return userAdminService.listAll();
  }

  public record ActiveBody(boolean active) {}

  @PatchMapping("/{id}/active")
  @PreAuthorize("hasRole('ADMIN')")
  public UserAdminResponse setActive(
      @PathVariable UUID id, @RequestBody Map<String, Boolean> body) {
    boolean active = Boolean.TRUE.equals(body.get("active"));
    return userAdminService.setActive(id, active);
  }
}
