package com.healthcare.doctor.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doctor_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfile {

  @Id
  @Column(name = "user_id")
  private UUID userId;

  @Column(name = "full_name", nullable = false)
  private String fullName;

  @Column(nullable = false)
  private String specialty;

  @Column private String bio;

  @Column(nullable = false)
  private boolean verified;
}
