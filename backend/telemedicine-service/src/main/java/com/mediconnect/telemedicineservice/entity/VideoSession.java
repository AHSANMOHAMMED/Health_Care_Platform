package com.mediconnect.telemedicineservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "video_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;
    
    @Column(name = "appointment_id", nullable = false, unique = true)
    private Long appointmentId;
    
    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;
    
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @Column(name = "room_name", nullable = false, unique = true, length = 255)
    private String roomName;
    
    @Column(name = "meeting_url", nullable = false, length = 500)
    private String meetingUrl;
    
    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "SCHEDULED"; // SCHEDULED, ACTIVE, COMPLETED, CANCELLED
    
    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "ended_at")
    private LocalDateTime endedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "recording_url", length = 500)
    private String recordingUrl;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
}
