package com.mediconnect.patient_service.controller;

import com.mediconnect.patient_service.dto.ProfileRequest;
import com.mediconnect.patient_service.entity.PatientProfile;
import com.mediconnect.patient_service.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/{userId}")
    public ResponseEntity<PatientProfile> getProfile(@PathVariable Long userId, @RequestHeader(value = "Authorization", required = false) String token) {
        // Implementation with Feign validate would go mapped in an interceptor 
        // to simplify we trust GW or do manual check
        return ResponseEntity.ok(patientService.getProfile(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<PatientProfile> updateProfile(
            @PathVariable Long userId, 
            @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(patientService.updateProfile(userId, request));
    }
}
