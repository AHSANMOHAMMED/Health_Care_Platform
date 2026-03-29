package com.healthcare.telemedicine.web;

import com.healthcare.telemedicine.domain.VideoSession;
import com.healthcare.telemedicine.repo.VideoSessionRepository;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SessionService {

  private final VideoSessionRepository videoSessionRepository;

  @Value("${agora.app-id:demo-app-id}")
  private String appId;

  @Value("${agora.app-certificate:}")
  private String certificate;

  public SessionResponse create(UUID appointmentId, UUID patientUserId, UUID doctorUserId) {
    String channel = "hc-" + appointmentId.toString().replace("-", "").substring(0, 12);
    long uid = Math.floorMod(patientUserId.hashCode(), 1_000_000);
    String token;
    String message;
    if (certificate == null || certificate.isBlank()) {
      token =
          Base64.getUrlEncoder()
              .withoutPadding()
              .encodeToString(
                  ("MOCK|" + channel + "|" + uid + "|" + Instant.now().getEpochSecond())
                      .getBytes(StandardCharsets.UTF_8));
      message =
          "MOCK token for local dev. Set AGORA_APP_ID and AGORA_APP_CERTIFICATE for real Agora RTC tokens.";
    } else {
      token = signHmac("RTC" + channel + uid + Instant.now().getEpochSecond());
      message = "HMAC-signed dev token placeholder (swap in Agora RtcTokenBuilder2 for production).";
    }
    VideoSession vs = new VideoSession();
    vs.setAppointmentId(appointmentId);
    vs.setChannel(channel);
    videoSessionRepository.save(vs);
    return new SessionResponse(appId, channel, token, uid, message);
  }

  private String signHmac(String payload) {
    try {
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(new SecretKeySpec(certificate.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
      byte[] out = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
      return Base64.getUrlEncoder().withoutPadding().encodeToString(out);
    } catch (Exception e) {
      throw new IllegalStateException(e);
    }
  }

  public record SessionResponse(
      String appId, String channel, String token, long uid, String message) {}
}
