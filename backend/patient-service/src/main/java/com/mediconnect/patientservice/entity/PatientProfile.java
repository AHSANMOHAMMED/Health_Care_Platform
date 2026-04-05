package com.mediconnect.patientservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "patient_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private Long userId; // Tied from auth-service
    
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private String bloodGroup;
    private LocalDate dateOfBirth;
    
    @Column(columnDefinition = "TEXT")
    private String medicalHistory;
}
