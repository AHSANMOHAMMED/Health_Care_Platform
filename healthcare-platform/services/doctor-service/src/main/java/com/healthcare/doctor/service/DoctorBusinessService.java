package com.healthcare.doctor.service;

import com.healthcare.doctor.client.UserServiceClient;
import com.healthcare.doctor.client.dto.UserReportSummary;
import com.healthcare.doctor.domain.AvailabilitySlot;
import com.healthcare.doctor.domain.DoctorProfile;
import com.healthcare.doctor.repo.AvailabilitySlotRepository;
import com.healthcare.doctor.repo.DoctorProfileRepository;
import com.healthcare.doctor.web.dto.AvailabilityRequest;
import com.healthcare.doctor.web.dto.DoctorProfileRequest;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DoctorBusinessService {

  private final DoctorProfileRepository doctors;
  private final AvailabilitySlotRepository slots;
  private final UserServiceClient userServiceClient;

  @Transactional
  public DoctorProfile createProfile(UUID userId, DoctorProfileRequest req) {
    if (doctors.findByUserId(userId).isPresent()) {
      throw new IllegalArgumentException("Profile already exists");
    }
    DoctorProfile d =
        DoctorProfile.builder()
            .userId(userId)
            .fullName(req.fullName())
            .specialty(req.specialty())
            .bio(req.bio())
            .verified(false)
            .build();
    return doctors.save(d);
  }

  public DoctorProfile me(UUID userId) {
    return doctors.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("Not found"));
  }

  @Transactional
  public DoctorProfile update(UUID userId, DoctorProfileRequest req) {
    DoctorProfile d = me(userId);
    d.setFullName(req.fullName());
    d.setSpecialty(req.specialty());
    d.setBio(req.bio());
    return doctors.save(d);
  }

  @Transactional
  public void setAvailability(UUID userId, AvailabilityRequest req) {
    me(userId);
    slots.deleteByDoctorUserId(userId);
    for (var s : req.slots()) {
      Instant a = Instant.parse(s.startAt());
      Instant b = Instant.parse(s.endAt());
      if (!b.isAfter(a)) throw new IllegalArgumentException("Invalid slot");
      slots.save(
          AvailabilitySlot.builder().doctorUserId(userId).startAt(a).endAt(b).build());
    }
  }

  public List<DoctorProfile> searchVerified(String specialty) {
    if (specialty == null || specialty.isBlank()) {
      return doctors.findByVerifiedTrue();
    }
    return doctors.findByVerifiedTrue().stream()
        .filter(d -> d.getSpecialty().toLowerCase().contains(specialty.toLowerCase()))
        .toList();
  }

  @Transactional
  public DoctorProfile verify(UUID doctorUserId, boolean verified) {
    DoctorProfile d =
        doctors.findByUserId(doctorUserId).orElseThrow(() -> new IllegalArgumentException("Not found"));
    d.setVerified(verified);
    return doctors.save(d);
  }

  public List<DoctorProfile> pending() {
    return doctors.findByVerifiedFalse();
  }

  public DoctorProfile internalGet(UUID userId) {
    return doctors.findByUserId(userId).orElse(null);
  }

  public boolean coversSlot(UUID doctorUserId, Instant start, Instant end) {
    DoctorProfile d =
        doctors.findByUserId(doctorUserId).orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
    if (!d.isVerified()) return false;
    return slots.findByDoctorUserId(doctorUserId).stream()
        .anyMatch(
            s ->
                !s.getStartAt().isAfter(start)
                    && !s.getEndAt().isBefore(end));
  }

  public List<UserReportSummary> patientReports(UUID patientUserId) {
    return userServiceClient.listReports(patientUserId);
  }
}
