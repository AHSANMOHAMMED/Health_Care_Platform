package com.healthcare.telemedicine.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "video_sessions")
@Getter
@Setter
@NoArgsConstructor
public class VideoSession {

  @Id
  @UuidGenerator
  private UUID id;

  @Column(name = "appointment_id", nullable = false)
  private UUID appointmentId;

  @Column(nullable = false)
  private String channel;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private Instant createdAt;
}
