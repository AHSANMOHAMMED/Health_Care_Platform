package com.mediconnect.doctor_service.repository;

import com.mediconnect.doctor_service.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface DoctorRepository extends JpaRepository<DoctorProfile, Long> {
    Optional<DoctorProfile> findByUserId(Long userId);
    List<DoctorProfile> findBySpecializationContainingIgnoreCase(String specialization);
}
