package com.healthcare.appointment.client;

import java.time.Instant;
import java.util.UUID;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "doctorInternal", url = "${clients.doctor-service-url}")
public interface DoctorInternalClient {

  @GetMapping("/internal/v1/doctors/{userId}/covers")
  boolean covers(
      @PathVariable("userId") UUID userId,
      @RequestParam("start") Instant start,
      @RequestParam("end") Instant end);
}
