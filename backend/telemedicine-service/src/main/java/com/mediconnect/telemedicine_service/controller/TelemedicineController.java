package com.mediconnect.telemedicine_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/telemedicine")
public class TelemedicineController {

    @GetMapping("/generate-room")
    public ResponseEntity<Map<String, String>> generateRoomId() {
        String roomId = "MediConnect_" + UUID.randomUUID().toString();
        return ResponseEntity.ok(Map.of("roomId", roomId, "domain", "meet.jit.si"));
    }
}
