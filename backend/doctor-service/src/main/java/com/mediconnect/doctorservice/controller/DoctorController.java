package com.mediconnect.doctorservice.controller;

import com.mediconnect.doctorservice.dto.DocProfileRequest;
import com.mediconnect.doctorservice.entity.DoctorProfile;
import com.mediconnect.doctorservice.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping
    public ResponseEntity<List<DoctorProfile>> getDoctors(@RequestParam(required = false) String specialization) {
        if (specialization != null && !specialization.isEmpty()) {
            return ResponseEntity.ok(doctorRepository.findBySpecializationContainingIgnoreCaseAndIsVerifiedTrue(specialization));
        }
        return ResponseEntity.ok(doctorRepository.findByIsVerifiedTrue());
    }

    @GetMapping("/me")
    public ResponseEntity<DoctorProfile> getMyProfile(@RequestHeader("X-UserId") Long userId) {
        DoctorProfile profile = doctorRepository.findByUserId(userId).orElseGet(() -> {
            DoctorProfile p = new DoctorProfile();
            p.setUserId(userId);
            p.setVerified(false); // require admin verification
            return doctorRepository.save(p);
        });
        return ResponseEntity.ok(profile);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DoctorProfile> getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<DoctorProfile> updateMyProfile(
            @RequestHeader("X-UserId") Long userId, 
            @RequestBody DocProfileRequest request) {
            
        DoctorProfile profile = doctorRepository.findByUserId(userId).orElse(new DoctorProfile());
        profile.setUserId(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setSpecialization(request.getSpecialization());
        profile.setConsultationFee(request.getConsultationFee());
        profile.setQualifications(request.getQualifications());
        profile.setAvailabilitySlots(request.getAvailabilitySlots());
        // Do not update isVerified here!
        
        return ResponseEntity.ok(doctorRepository.save(profile));
    }
}
