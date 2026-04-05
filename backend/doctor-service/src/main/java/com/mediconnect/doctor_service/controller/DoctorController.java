package com.mediconnect.doctor_service.controller;

import com.mediconnect.doctor_service.dto.DoctorRequest;
import com.mediconnect.doctor_service.entity.DoctorProfile;
import com.mediconnect.doctor_service.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<DoctorProfile>> getAllDoctors(@RequestParam(required = false) String specialization) {
        if (specialization != null) {
            return ResponseEntity.ok(doctorService.searchBySpecialization(specialization));
        }
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<DoctorProfile> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(doctorService.getProfile(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<DoctorProfile> updateProfile(
            @PathVariable Long userId, 
            @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(doctorService.updateProfile(userId, request));
    }
}
