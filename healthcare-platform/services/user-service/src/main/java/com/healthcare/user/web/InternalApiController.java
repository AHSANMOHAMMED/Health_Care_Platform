package com.healthcare.user.web;

import com.healthcare.user.domain.PatientProfile;
import com.healthcare.user.service.PatientService;
import com.healthcare.user.service.ReportService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/v1")
@RequiredArgsConstructor
public class InternalApiController {

  private final PatientService patientService;
  private final ReportService reportService;

  @GetMapping("/patients/{userId}")
  public ResponseEntity<PatientProfile> patient(@PathVariable UUID userId) {
    PatientProfile p = patientService.findInternal(userId);
    return p == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(p);
  }

  @GetMapping("/patients/{userId}/reports")
  public List<ReportController.MedicalReportSummary> reports(@PathVariable UUID userId) {
    return reportService.listInternalByPatient(userId).stream()
        .map(
            r ->
                new ReportController.MedicalReportSummary(
                    r.getId(), r.getFilename(), r.getContentType(), r.getCreatedAt()))
        .toList();
  }

  @GetMapping("/reports/{reportId}/for-patient/{patientUserId}")
  public byte[] reportBytes(
      @PathVariable UUID reportId, @PathVariable UUID patientUserId) {
    return reportService.getInternal(reportId, patientUserId).getData();
  }
}
