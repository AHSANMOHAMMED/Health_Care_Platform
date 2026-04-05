package com.mediconnect.auth_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import com.mediconnect.auth_service.entity.Role;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private Role role;
}
