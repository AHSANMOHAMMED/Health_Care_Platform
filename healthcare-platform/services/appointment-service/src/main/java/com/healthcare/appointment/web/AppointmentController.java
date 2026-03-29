package com.healthcare.appointment.web;

import com.healthcare.appointment.domain.Appointment;
import com.healthcare.appointment.security.ApptUser;
import com.healthcare.appointment.service.AppointmentBusinessService;
import com.healthcare.appointment.service.AppointmentBusinessService.ApptActor;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AppointmentController {

  private final AppointmentBusinessService svc;

  public record BookRequest(
      @NotNull UUID doctorUserId,
      @NotNull Instant start,
      @NotNull Instant end,
      String notes) {}

  @PostMapping("/api/appointments")
  @PreAuthorize("hasRole('PATIENT')")
  public Appointment book(
      @AuthenticationPrincipal ApptUser user, @Valid @RequestBody BookRequest req) {
    return svc.book(user.getId(), req.doctorUserId(), req.start(), req.end(), req.notes());
  }

  @GetMapping("/api/appointments/me")
  @PreAuthorize("hasRole('PATIENT')")
  public List<Appointment> mine(@AuthenticationPrincipal ApptUser user) {
    return svc.minePatient(user.getId());
  }

  @GetMapping("/api/appointments/doctor/me")
  @PreAuthorize("hasRole('DOCTOR')")
  public List<Appointment> doctorMine(@AuthenticationPrincipal ApptUser user) {
    return svc.mineDoctor(user.getId());
  }

  @GetMapping("/api/appointments/{id}")
  @PreAuthorize("isAuthenticated()")
  public Appointment one(
      @PathVariable UUID id,
      @AuthenticationPrincipal ApptUser user) {
    if (user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
      return svc.get(id, ApptActor.ADMIN, user.getId());
    }
    if (user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DOCTOR"))) {
      return svc.get(id, ApptActor.DOCTOR, user.getId());
    }
    return svc.get(id, ApptActor.PATIENT, user.getId());
  }

  public record DoctorDecision(@NotNull Appointment.Status status) {}

  @PatchMapping("/api/appointments/{id}/doctor-status")
  @PreAuthorize("hasRole('DOCTOR')")
  public Appointment doctorDecide(
      @AuthenticationPrincipal ApptUser user,
      @PathVariable UUID id,
      @RequestBody DoctorDecision body) {
    return svc.doctorDecision(user.getId(), id, body.status());
  }

  @PatchMapping("/api/appointments/{id}/cancel")
  @PreAuthorize("hasRole('PATIENT')")
  public Appointment cancel(@AuthenticationPrincipal ApptUser user, @PathVariable UUID id) {
    return svc.patientCancel(user.getId(), id);
  }

  public record RxBody(@NotBlank String text) {}

  @PostMapping("/api/appointments/{id}/prescription")
  @PreAuthorize("hasRole('DOCTOR')")
  public Appointment rx(
      @AuthenticationPrincipal ApptUser user, @PathVariable UUID id, @RequestBody RxBody body) {
    return svc.prescribe(user.getId(), id, body.text());
  }

  @GetMapping("/api/prescriptions/me")
  @PreAuthorize("hasRole('PATIENT')")
  public List<Appointment> rxList(@AuthenticationPrincipal ApptUser user) {
    return svc.prescriptionsForPatient(user.getId());
  }
}
