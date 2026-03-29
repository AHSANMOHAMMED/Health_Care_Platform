package com.healthcare.appointment.client.dto;

import java.util.UUID;

public record VideoSessionRequest(UUID appointmentId, UUID patientUserId, UUID doctorUserId) {}
