package com.healthcare.doctor.web.dto;

import jakarta.validation.constraints.NotBlank;

public record DoctorProfileRequest(
    @NotBlank String fullName, @NotBlank String specialty, String bio) {}
