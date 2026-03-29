package com.healthcare.user.service;

import com.healthcare.user.domain.PatientProfile;
import com.healthcare.user.repo.PatientProfileRepository;
import com.healthcare.user.web.dto.PatientProfileRequest;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientService {

  private final PatientProfileRepository patients;

  @Transactional
  public PatientProfile createOrUpdate(UUID userId, PatientProfileRequest req) {
    PatientProfile p =
        patients.findByUserId(userId).orElseGet(() -> PatientProfile.builder().userId(userId).build());
    p.setFullName(req.fullName());
    p.setPhone(req.phone());
    p.setDateOfBirth(req.dateOfBirth());
    return patients.save(p);
  }

  public PatientProfile get(UUID userId) {
    return patients
        .findByUserId(userId)
        .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));
  }

  public PatientProfile findInternal(UUID userId) {
    return patients.findByUserId(userId).orElse(null);
  }
}
