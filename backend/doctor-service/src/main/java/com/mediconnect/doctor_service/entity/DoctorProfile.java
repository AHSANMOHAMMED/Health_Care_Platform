package com.mediconnect.doctor_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "doctor_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private Long userId; // Mapped from auth-service
    
    private String firstName;
    private String lastName;
    private String specialization;
    
    @Column(columnDefinition = "TEXT")
    private String qualifications;
    
    private String hospitalAffiliation;
    private BigDecimal consultationFee;
    
    private String availableDays; // e.g., "MON,WED,FRI"
    private String availableTimeStart; // e.g., "09:00"
    private String availableTimeEnd; // e.g., "17:00"
}
