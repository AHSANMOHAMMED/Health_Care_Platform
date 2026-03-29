package com.healthcare.user.repo;

import com.healthcare.user.domain.PatientProfile;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, UUID> {
  Optional<PatientProfile> findByUserId(UUID userId);
}
