package com.mediconnect.doctorservice.repository;

import com.mediconnect.doctorservice.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<DoctorProfile, Long> {
    Optional<DoctorProfile> findByUserId(Long userId);
    List<DoctorProfile> findBySpecializationContainingIgnoreCaseAndIsVerifiedTrue(String spec);
    List<DoctorProfile> findByIsVerifiedTrue();
}
