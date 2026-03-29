package com.healthcare.user.web.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record PatientProfileRequest(
    @NotBlank String fullName, String phone, LocalDate dateOfBirth) {}
