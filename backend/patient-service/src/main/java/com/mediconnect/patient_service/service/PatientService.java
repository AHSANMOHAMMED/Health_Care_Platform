package com.mediconnect.patient_service.service;

import com.mediconnect.patient_service.dto.ProfileRequest;
import com.mediconnect.patient_service.entity.PatientProfile;
import com.mediconnect.patient_service.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {
    
    private final PatientRepository patientRepository;

    public PatientProfile getProfile(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseGet(() -> {
                    PatientProfile profile = new PatientProfile();
                    profile.setUserId(userId);
                    return patientRepository.save(profile);
                });
    }

    public PatientProfile updateProfile(Long userId, ProfileRequest request) {
        PatientProfile profile = getProfile(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setBloodGroup(request.getBloodGroup());
        profile.setMedicalHistory(request.getMedicalHistory());
        return patientRepository.save(profile);
    }
}
