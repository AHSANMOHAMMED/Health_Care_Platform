package com.healthcare.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "patient_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfile {

  @Id
  @Column(name = "user_id")
  private UUID userId;

  @Column(name = "full_name", nullable = false)
  private String fullName;

  private String phone;

  @Column(name = "date_of_birth")
  private LocalDate dateOfBirth;
}
