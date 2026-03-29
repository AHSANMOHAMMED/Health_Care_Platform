package com.healthcare.appointment.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OptionalEventPublisher {

  private final RabbitTemplate rabbit;

  @Value("${healthcare.rabbit.exchange:healthcare.events}")
  private String exchange;

  public void publishBooked(UUID apptId, UUID patient, UUID doctor) {
    try {
      rabbit.convertAndSend(
          exchange,
          "appointment.booked",
          "appointmentId=" + apptId + ",patient=" + patient + ",doctor=" + doctor);
    } catch (Exception ignored) {
    }
  }

  public void publishCompleted(UUID apptId, UUID patient, UUID doctor) {
    try {
      rabbit.convertAndSend(
          exchange,
          "consultation.completed",
          "appointmentId=" + apptId + ",patient=" + patient + ",doctor=" + doctor);
    } catch (Exception ignored) {
    }
  }
}
