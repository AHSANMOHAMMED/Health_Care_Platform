package com.healthcare.notify.web;

import com.healthcare.notify.twilio.TwilioNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

  private final TwilioNotificationService twilio;

  public record SmsRequest(String to, String message) {}

  @PostMapping("/sms")
  public String sms(@RequestBody SmsRequest req) {
    twilio.sms(req.to(), req.message());
    return "queued";
  }
}
