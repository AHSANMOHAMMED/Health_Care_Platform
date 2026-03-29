package com.healthcare.doctor.client.dto;

import java.time.Instant;
import java.util.UUID;

public record UserReportSummary(UUID id, String filename, String contentType, Instant createdAt) {}
