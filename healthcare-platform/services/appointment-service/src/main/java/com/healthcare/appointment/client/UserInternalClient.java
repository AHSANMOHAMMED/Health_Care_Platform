package com.healthcare.appointment.client;

import com.healthcare.appointment.client.dto.PatientProfileDto;
import java.util.UUID;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "userInternal", url = "${clients.user-service-url}")
public interface UserInternalClient {
  @GetMapping("/internal/v1/patients/{userId}")
  PatientProfileDto getPatient(@PathVariable("userId") UUID userId);
}
