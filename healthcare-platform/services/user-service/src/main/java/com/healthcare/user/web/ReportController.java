package com.healthcare.user.web;

import com.healthcare.user.domain.MedicalReport;
import com.healthcare.user.security.AccountPrincipal;
import com.healthcare.user.service.ReportService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

  private final ReportService reportService;

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasRole('PATIENT')")
  public MedicalReport upload(
      @AuthenticationPrincipal AccountPrincipal user, @RequestPart("file") MultipartFile file)
      throws Exception {
    return reportService.upload(user.getId(), file);
  }

  @GetMapping("/my")
  @PreAuthorize("hasRole('PATIENT')")
  public List<MedicalReportSummary> my(@AuthenticationPrincipal AccountPrincipal user) {
    return reportService.listForPatient(user.getId()).stream()
        .map(
            r ->
                new MedicalReportSummary(
                    r.getId(), r.getFilename(), r.getContentType(), r.getCreatedAt()))
        .toList();
  }

  @GetMapping("/{id}/download")
  @PreAuthorize("hasRole('PATIENT')")
  public ResponseEntity<Resource> download(
      @AuthenticationPrincipal AccountPrincipal user, @PathVariable UUID id) {
    MedicalReport r = reportService.getForPatient(id, user.getId());
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + r.getFilename() + "\"")
        .contentType(MediaType.parseMediaType(r.getContentType()))
        .body(new ByteArrayResource(r.getData()));
  }

  public record MedicalReportSummary(
      java.util.UUID id, String filename, String contentType, java.time.Instant createdAt) {}
}
