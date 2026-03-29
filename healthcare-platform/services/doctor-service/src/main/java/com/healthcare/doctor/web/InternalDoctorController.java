package com.healthcare.doctor.web;

import com.healthcare.doctor.domain.DoctorProfile;
import com.healthcare.doctor.service.DoctorBusinessService;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/v1/doctors")
@RequiredArgsConstructor
public class InternalDoctorController {

  private final DoctorBusinessService doctors;

  @GetMapping("/user/{userId}")
  public DoctorProfile byUser(@PathVariable UUID userId) {
    return doctors.internalGet(userId);
  }

  @GetMapping("/{userId}/covers")
  public boolean covers(
      @PathVariable UUID userId,
      @RequestParam Instant start,
      @RequestParam Instant end) {
    return doctors.coversSlot(userId, start, end);
  }
}
