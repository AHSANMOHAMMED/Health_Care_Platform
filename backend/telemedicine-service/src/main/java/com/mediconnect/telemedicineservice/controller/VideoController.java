package com.mediconnect.telemedicineservice.controller;

import com.mediconnect.telemedicineservice.dto.CreateSessionRequest;
import com.mediconnect.telemedicineservice.dto.VideoSessionResponse;
import com.mediconnect.telemedicineservice.service.VideoSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/telemedicine")
@RequiredArgsConstructor
public class VideoController {

    private final VideoSessionService sessionService;

    @PostMapping("/sessions")
    public ResponseEntity<VideoSessionResponse> createSession(@Valid @RequestBody CreateSessionRequest request) {
        VideoSessionResponse response = sessionService.createSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<VideoSessionResponse> getSessionById(@PathVariable Long sessionId) {
        VideoSessionResponse response = sessionService.getSessionById(sessionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions/appointment/{appointmentId}")
    public ResponseEntity<VideoSessionResponse> getSessionByAppointment(@PathVariable Long appointmentId) {
        VideoSessionResponse response = sessionService.getSessionByAppointment(appointmentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions/doctor/{doctorId}")
    public ResponseEntity<List<VideoSessionResponse>> getSessionsByDoctor(@PathVariable Long doctorId) {
        List<VideoSessionResponse> responses = sessionService.getSessionsByDoctor(doctorId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/sessions/patient/{patientId}")
    public ResponseEntity<List<VideoSessionResponse>> getSessionsByPatient(@PathVariable Long patientId) {
        List<VideoSessionResponse> responses = sessionService.getSessionsByPatient(patientId);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/sessions/{sessionId}/start")
    public ResponseEntity<VideoSessionResponse> startSession(@PathVariable Long sessionId) {
        VideoSessionResponse response = sessionService.startSession(sessionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sessions/{sessionId}/end")
    public ResponseEntity<VideoSessionResponse> endSession(@PathVariable Long sessionId) {
        VideoSessionResponse response = sessionService.endSession(sessionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sessions/{sessionId}/cancel")
    public ResponseEntity<VideoSessionResponse> cancelSession(@PathVariable Long sessionId) {
        VideoSessionResponse response = sessionService.cancelSession(sessionId);
        return ResponseEntity.ok(response);
    }

    // Legacy endpoint for backward compatibility
    @GetMapping("/generate-room")
    public ResponseEntity<String> generateRoom() {
        String roomName = "mediconnect-" + java.util.UUID.randomUUID().toString();
        return ResponseEntity.ok("https://meet.jit.si/" + roomName);
    }
}
