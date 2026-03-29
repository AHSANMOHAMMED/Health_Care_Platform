package com.healthcare.doctor.repo;

import com.healthcare.doctor.domain.AvailabilitySlot;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, UUID> {
  void deleteByDoctorUserId(UUID doctorUserId);

  java.util.List<AvailabilitySlot> findByDoctorUserId(UUID doctorUserId);
}
