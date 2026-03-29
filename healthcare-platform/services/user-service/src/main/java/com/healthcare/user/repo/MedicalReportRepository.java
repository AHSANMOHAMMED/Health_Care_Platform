package com.healthcare.user.repo;

import com.healthcare.user.domain.MedicalReport;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalReportRepository extends JpaRepository<MedicalReport, UUID> {
  List<MedicalReport> findByPatientUserIdOrderByCreatedAtDesc(UUID patientUserId);
}
