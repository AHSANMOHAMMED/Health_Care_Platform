package com.mediconnect.telemedicineservice.service;

import com.mediconnect.telemedicineservice.dto.CreateSessionRequest;
import com.mediconnect.telemedicineservice.dto.VideoSessionResponse;
import com.mediconnect.telemedicineservice.entity.VideoSession;
import com.mediconnect.telemedicineservice.repository.VideoSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoSessionService {
    
    private final VideoSessionRepository sessionRepository;
    
    @Transactional
    public VideoSessionResponse createSession(CreateSessionRequest request) {
        // Check if session already exists for this appointment
        sessionRepository.findByAppointmentId(request.getAppointmentId())
            .ifPresent(existing -> {
                throw new RuntimeException("Video session already exists for appointment: " + request.getAppointmentId());
            });
        
        // Generate unique room name
        String roomName = "mediconnect-" + request.getAppointmentId() + "-" + UUID.randomUUID().toString().substring(0, 8);
        String meetingUrl = "https://meet.jit.si/" + roomName;
        
        VideoSession session = VideoSession.builder()
                .appointmentId(request.getAppointmentId())
                .doctorId(request.getDoctorId())
                .patientId(request.getPatientId())
                .roomName(roomName)
                .meetingUrl(meetingUrl)
                .status("SCHEDULED")
                .scheduledAt(request.getScheduledAt() != null ? request.getScheduledAt() : LocalDateTime.now().plusMinutes(5))
                .build();
        
        VideoSession saved = sessionRepository.save(session);
        return mapToResponse(saved);
    }
    
    public VideoSessionResponse getSessionById(Long sessionId) {
        VideoSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Video session not found: " + sessionId));
        return mapToResponse(session);
    }
    
    public VideoSessionResponse getSessionByAppointment(Long appointmentId) {
        VideoSession session = sessionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Video session not found for appointment: " + appointmentId));
        return mapToResponse(session);
    }
    
    public List<VideoSessionResponse> getSessionsByDoctor(Long doctorId) {
        return sessionRepository.findByDoctorIdOrderByScheduledAtDesc(doctorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<VideoSessionResponse> getSessionsByPatient(Long patientId) {
        return sessionRepository.findByPatientIdOrderByScheduledAtDesc(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public VideoSessionResponse startSession(Long sessionId) {
        VideoSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Video session not found: " + sessionId));
        
        session.setStatus("ACTIVE");
        session.setStartedAt(LocalDateTime.now());
        
        VideoSession updated = sessionRepository.save(session);
        return mapToResponse(updated);
    }
    
    @Transactional
    public VideoSessionResponse endSession(Long sessionId) {
        VideoSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Video session not found: " + sessionId));
        
        session.setStatus("COMPLETED");
        session.setEndedAt(LocalDateTime.now());
        
        // Calculate duration
        if (session.getStartedAt() != null) {
            int duration = (int) java.time.Duration.between(session.getStartedAt(), session.getEndedAt()).toMinutes();
            session.setDurationMinutes(duration);
        }
        
        VideoSession updated = sessionRepository.save(session);
        return mapToResponse(updated);
    }
    
    @Transactional
    public VideoSessionResponse cancelSession(Long sessionId) {
        VideoSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Video session not found: " + sessionId));
        
        session.setStatus("CANCELLED");
        
        VideoSession updated = sessionRepository.save(session);
        return mapToResponse(updated);
    }
    
    private VideoSessionResponse mapToResponse(VideoSession session) {
        return VideoSessionResponse.builder()
                .sessionId(session.getSessionId())
                .appointmentId(session.getAppointmentId())
                .doctorId(session.getDoctorId())
                .patientId(session.getPatientId())
                .roomName(session.getRoomName())
                .meetingUrl(session.getMeetingUrl())
                .status(session.getStatus())
                .scheduledAt(session.getScheduledAt())
                .startedAt(session.getStartedAt())
                .endedAt(session.getEndedAt())
                .createdAt(session.getCreatedAt())
                .recordingUrl(session.getRecordingUrl())
                .durationMinutes(session.getDurationMinutes())
                .build();
    }
}
