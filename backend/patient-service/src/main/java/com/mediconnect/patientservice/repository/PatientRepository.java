package com.mediconnect.patientservice.repository;

import com.mediconnect.patientservice.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<PatientProfile, Long> {
    Optional<PatientProfile> findByUserId(Long userId);
}
