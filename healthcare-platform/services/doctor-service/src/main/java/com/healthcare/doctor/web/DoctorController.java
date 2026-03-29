package com.healthcare.doctor.web;

import com.healthcare.doctor.client.dto.UserReportSummary;
import com.healthcare.doctor.domain.DoctorProfile;
import com.healthcare.doctor.security.DoctorUser;
import com.healthcare.doctor.service.DoctorBusinessService;
import com.healthcare.doctor.web.dto.AvailabilityRequest;
import com.healthcare.doctor.web.dto.DoctorProfileRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

  private final DoctorBusinessService doctors;

  @PostMapping("/me")
  @PreAuthorize("hasRole('DOCTOR')")
  @ResponseStatus(HttpStatus.CREATED)
  public DoctorProfile create(
      @AuthenticationPrincipal DoctorUser user, @Valid @RequestBody DoctorProfileRequest req) {
    return doctors.createProfile(user.getId(), req);
  }

  @GetMapping("/me")
  @PreAuthorize("hasRole('DOCTOR')")
  public DoctorProfile me(@AuthenticationPrincipal DoctorUser user) {
    return doctors.me(user.getId());
  }

  @PatchMapping("/me")
  @PreAuthorize("hasRole('DOCTOR')")
  public DoctorProfile update(
      @AuthenticationPrincipal DoctorUser user, @Valid @RequestBody DoctorProfileRequest req) {
    return doctors.update(user.getId(), req);
  }

  @PostMapping("/me/availability")
  @PreAuthorize("hasRole('DOCTOR')")
  public void availability(
      @AuthenticationPrincipal DoctorUser user, @Valid @RequestBody AvailabilityRequest req) {
    doctors.setAvailability(user.getId(), req);
  }

  @GetMapping("/search")
  public List<DoctorProfile> search(@RequestParam(required = false) String specialty) {
    return doctors.searchVerified(specialty);
  }

  @GetMapping("/patients/{patientUserId}/reports")
  @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
  public List<UserReportSummary> patientReports(@PathVariable UUID patientUserId) {
    return doctors.patientReports(patientUserId);
  }

  @GetMapping("/admin/pending")
  @PreAuthorize("hasRole('ADMIN')")
  public List<DoctorProfile> pending() {
    return doctors.pending();
  }

  public record VerifyBody(boolean verified) {}

  @PatchMapping("/admin/{userId}/verification")
  @PreAuthorize("hasRole('ADMIN')")
  public DoctorProfile verify(@PathVariable UUID userId, @RequestBody VerifyBody body) {
    return doctors.verify(userId, body.verified());
  }
}
