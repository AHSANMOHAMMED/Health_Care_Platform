package com.healthcare.appointment.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PatientProfileDto(UUID userId, String fullName, String phone) {}
