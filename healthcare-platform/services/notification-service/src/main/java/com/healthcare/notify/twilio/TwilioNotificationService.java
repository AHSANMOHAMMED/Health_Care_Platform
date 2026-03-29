package com.healthcare.notify.twilio;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TwilioNotificationService {

  private final boolean configured;
  private final String fromPhone;

  public TwilioNotificationService(
      @Value("${twilio.account-sid:}") String sid,
      @Value("${twilio.auth-token:}") String token,
      @Value("${twilio.from-phone:}") String fromPhone) {
    this.fromPhone = fromPhone == null ? "" : fromPhone;
    this.configured =
        sid != null && !sid.isBlank() && token != null && !token.isBlank() && !this.fromPhone.isBlank();
    if (configured) {
      Twilio.init(sid, token);
    }
  }

  public void sms(String to, String body) {
    if (!configured) {
      log.info("[SMS noop] to={} body={}", to, body);
      return;
    }
    Message.creator(new PhoneNumber(to), new PhoneNumber(fromPhone), body).create();
  }
}
