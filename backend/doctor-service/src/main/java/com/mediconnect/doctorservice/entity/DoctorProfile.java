package com.mediconnect.doctorservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private Long userId; // Tied from auth-service
    
    private String firstName;
    private String lastName;
    private String specialization;
    private Double consultationFee;
    
    @Column(columnDefinition = "TEXT")
    private String qualifications;
    
    private String availabilitySlots; // Simple string CSV format for assignment ease. e.g. "Mon 9AM-11AM, Wed 2PM-4PM"
    private boolean isVerified; // Needs admin approval to appear in search
}
