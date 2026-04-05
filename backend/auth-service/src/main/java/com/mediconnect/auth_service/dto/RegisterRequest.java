package com.mediconnect.auth_service.dto;
import lombok.Data;
import com.mediconnect.auth_service.entity.Role;
@Data
public class RegisterRequest {
    private String email;
    private String password;
    private Role role;
}
