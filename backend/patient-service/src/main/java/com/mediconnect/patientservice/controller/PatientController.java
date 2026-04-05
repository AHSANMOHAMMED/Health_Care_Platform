package com.mediconnect.patientservice.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediconnect.patientservice.dto.ProfileRequest;
import com.mediconnect.patientservice.entity.PatientProfile;
import com.mediconnect.patientservice.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/me")
    public ResponseEntity<PatientProfile> getMyProfile(@RequestHeader("X-UserId") Long userId) {
        PatientProfile profile = patientRepository.findByUserId(userId).orElseGet(() -> {
            PatientProfile p = new PatientProfile();
            p.setUserId(userId);
            return patientRepository.save(p);
        });
        return ResponseEntity.ok(profile);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PatientProfile> getProfileById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<PatientProfile> updateMyProfile(
            @RequestHeader("X-UserId") Long userId, 
            @RequestBody ProfileRequest request) {
            
        PatientProfile profile = patientRepository.findByUserId(userId).orElse(new PatientProfile());
        profile.setUserId(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setBloodGroup(request.getBloodGroup());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setMedicalHistory(request.getMedicalHistory());
        
        return ResponseEntity.ok(patientRepository.save(profile));
    }

    @PostMapping(value = "/onboarding", consumes = {"multipart/form-data"})
    public ResponseEntity<PatientProfile> completeOnboarding(
            @RequestHeader("X-UserId") Long userId,
            @RequestParam("personalInfo") String personalInfoJson,
            @RequestParam("medicalHistory") String medicalHistoryJson,
            @RequestParam(value = "insuranceInfo", required = false) String insuranceInfoJson,
            @RequestParam(required = false) MultipartFile[] files
    ) throws IOException {
        JsonNode personalInfo = objectMapper.readTree(personalInfoJson);
        JsonNode medicalHistory = objectMapper.readTree(medicalHistoryJson);

        PatientProfile profile = patientRepository.findByUserId(userId).orElse(new PatientProfile());
        profile.setUserId(userId);
        profile.setFirstName(personalInfo.path("firstName").asText(profile.getFirstName()));
        profile.setLastName(personalInfo.path("lastName").asText(profile.getLastName()));
        profile.setPhone(personalInfo.path("phone").asText(profile.getPhone()));
        profile.setAddress(personalInfo.path("address").asText(profile.getAddress()));
        profile.setBloodGroup(personalInfo.path("bloodType").asText(profile.getBloodGroup()));

        String dateOfBirth = personalInfo.path("dateOfBirth").asText("");
        if (!dateOfBirth.isBlank()) {
            profile.setDateOfBirth(LocalDate.parse(dateOfBirth));
        }

        JsonNode conditions = medicalHistory.path("conditions");
        JsonNode medications = medicalHistory.path("medications");
        JsonNode allergies = medicalHistory.path("allergies");
        String summary = "Conditions: " + conditions.toString()
                + "; Medications: " + medications.toString()
                + "; Allergies: " + allergies.toString();
        profile.setMedicalHistory(summary);

        // Files and insurance payload are accepted for API compatibility; document persistence can be added later.
        PatientProfile saved = patientRepository.save(profile);
        return ResponseEntity.ok(saved);
    }
}
