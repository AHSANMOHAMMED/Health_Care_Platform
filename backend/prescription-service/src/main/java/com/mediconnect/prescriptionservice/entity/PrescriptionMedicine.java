package com.mediconnect.prescriptionservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "prescription_medicines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionMedicine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medicine_id")
    private Long medicineId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;
    
    @Column(name = "medicine_name", nullable = false, length = 255)
    private String medicineName;
    
    @Column(name = "dosage", nullable = false, length = 100)
    private String dosage;
    
    @Column(name = "frequency", nullable = false, length = 100)
    private String frequency;
    
    @Column(name = "duration", nullable = false, length = 100)
    private String duration;
    
    @Column(name = "notes", length = 500)
    private String notes;
}
