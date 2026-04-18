package com.mediconnect.telemedicineservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoSessionResponse {
    private Long sessionId;
    private Long appointmentId;
    private Long doctorId;
    private Long patientId;
    private String roomName;
    private String meetingUrl;
    private String status;
    private LocalDateTime scheduledAt;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private LocalDateTime createdAt;
    private String recordingUrl;
    private Integer durationMinutes;
    
    // JWT token for authenticated Jitsi rooms (if using self-hosted)
    private String jitsiToken;
}
