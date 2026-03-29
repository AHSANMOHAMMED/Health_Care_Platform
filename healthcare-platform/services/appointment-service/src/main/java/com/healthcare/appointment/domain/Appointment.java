package com.healthcare.appointment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

  public enum Status {
    PENDING,
    CONFIRMED,
    REJECTED,
    CANCELLED,
    COMPLETED
  }

  @Id
  @UuidGenerator
  private UUID id;

  @Column(name = "patient_user_id", nullable = false)
  private UUID patientUserId;

  @Column(name = "doctor_user_id", nullable = false)
  private UUID doctorUserId;

  @Column(name = "start_at", nullable = false)
  private Instant startAt;

  @Column(name = "end_at", nullable = false)
  private Instant endAt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Status status;

  @Column(name = "video_channel")
  private String videoChannel;

  @Column(name = "video_token")
  private String videoToken;

  @Column(name = "prescription_text", length = 4000)
  private String prescriptionText;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;
}
