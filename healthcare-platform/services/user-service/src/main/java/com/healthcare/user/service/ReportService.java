package com.healthcare.user.service;

import com.healthcare.user.domain.MedicalReport;
import com.healthcare.user.repo.MedicalReportRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ReportService {

  private final MedicalReportRepository reports;

  @Transactional
  public MedicalReport upload(UUID patientUserId, MultipartFile file) throws Exception {
    if (file.isEmpty()) throw new IllegalArgumentException("Empty file");
    MedicalReport r =
        MedicalReport.builder()
            .patientUserId(patientUserId)
            .filename(file.getOriginalFilename())
            .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
            .data(file.getBytes())
            .build();
    return reports.save(r);
  }

  public List<MedicalReport> listForPatient(UUID patientUserId) {
    return reports.findByPatientUserIdOrderByCreatedAtDesc(patientUserId);
  }

  public MedicalReport getForPatient(UUID reportId, UUID patientUserId) {
    MedicalReport r =
        reports.findById(reportId).orElseThrow(() -> new IllegalArgumentException("Report not found"));
    if (!r.getPatientUserId().equals(patientUserId)) {
      throw new SecurityException("Forbidden");
    }
    return r;
  }

  public MedicalReport getInternal(UUID reportId, UUID patientUserId) {
    MedicalReport r =
        reports.findById(reportId).orElseThrow(() -> new IllegalArgumentException("Report not found"));
    if (!r.getPatientUserId().equals(patientUserId)) {
      throw new IllegalArgumentException("Mismatch");
    }
    return r;
  }

  public List<MedicalReport> listInternalByPatient(UUID patientUserId) {
    return reports.findByPatientUserIdOrderByCreatedAtDesc(patientUserId);
  }
}
