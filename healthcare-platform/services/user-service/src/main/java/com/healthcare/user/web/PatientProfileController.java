package com.healthcare.user.web;

import com.healthcare.user.domain.PatientProfile;
import com.healthcare.user.security.AccountPrincipal;
import com.healthcare.user.service.PatientService;
import com.healthcare.user.web.dto.PatientProfileRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientProfileController {

  private final PatientService patientService;

  @PostMapping("/me")
  @PreAuthorize("hasRole('PATIENT')")
  @ResponseStatus(HttpStatus.CREATED)
  public PatientProfile create(
      @AuthenticationPrincipal AccountPrincipal user,
      @Valid @RequestBody PatientProfileRequest req) {
    if (patientService.findInternal(user.getId()) != null) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Profile already exists");
    }
    return patientService.createOrUpdate(user.getId(), req);
  }

  @GetMapping("/me")
  @PreAuthorize("hasRole('PATIENT')")
  public PatientProfile me(@AuthenticationPrincipal AccountPrincipal user) {
    return patientService.get(user.getId());
  }

  @PutMapping("/me")
  @PreAuthorize("hasRole('PATIENT')")
  public PatientProfile update(
      @AuthenticationPrincipal AccountPrincipal user,
      @Valid @RequestBody PatientProfileRequest req) {
    return patientService.createOrUpdate(user.getId(), req);
  }
}
