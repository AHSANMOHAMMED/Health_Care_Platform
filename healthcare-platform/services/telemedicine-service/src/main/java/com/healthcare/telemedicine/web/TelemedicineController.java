package com.healthcare.telemedicine.web;

import com.healthcare.telemedicine.web.SessionService.SessionResponse;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/telemedicine")
@RequiredArgsConstructor
public class TelemedicineController {

  private final SessionService sessionService;

  public record SessionRequest(UUID appointmentId, UUID patientUserId, UUID doctorUserId) {}

  @PostMapping("/sessions")
  public SessionResponse session(@RequestBody SessionRequest req) {
    return sessionService.create(req.appointmentId(), req.patientUserId(), req.doctorUserId());
  }
}
