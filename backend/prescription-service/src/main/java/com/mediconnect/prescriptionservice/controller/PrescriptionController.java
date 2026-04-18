package com.mediconnect.prescriptionservice.controller;

import com.mediconnect.prescriptionservice.dto.*;
import com.mediconnect.prescriptionservice.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    
    private final PrescriptionService prescriptionService;
    
    @PostMapping
    public ResponseEntity<PrescriptionResponse> createPrescription(
            @Valid @RequestBody CreatePrescriptionRequest request) {
        PrescriptionResponse response = prescriptionService.createPrescription(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionResponse> getPrescriptionById(@PathVariable Long id) {
        PrescriptionResponse response = prescriptionService.getPrescriptionById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByPatient(
            @PathVariable Long patientId) {
        List<PrescriptionResponse> responses = prescriptionService.getPrescriptionsByPatient(patientId);
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByDoctor(
            @PathVariable Long doctorId) {
        List<PrescriptionResponse> responses = prescriptionService.getPrescriptionsByDoctor(doctorId);
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<PrescriptionResponse> getPrescriptionByAppointment(
            @PathVariable Long appointmentId) {
        PrescriptionResponse response = prescriptionService.getPrescriptionByAppointment(appointmentId);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<PrescriptionResponse> updatePrescriptionStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePrescriptionStatusRequest request) {
        PrescriptionResponse response = prescriptionService.updateStatus(id, request);
        return ResponseEntity.ok(response);
    }
}
