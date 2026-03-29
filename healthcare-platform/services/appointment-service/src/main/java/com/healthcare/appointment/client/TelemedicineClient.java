package com.healthcare.appointment.client;

import com.healthcare.appointment.client.dto.VideoSessionRequest;
import com.healthcare.appointment.client.dto.VideoSessionResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "telemedicine", url = "${clients.telemedicine-service-url}")
public interface TelemedicineClient {

  @PostMapping("/api/telemedicine/sessions")
  VideoSessionResponse createSession(@RequestBody VideoSessionRequest req);
}
