package com.mediconnect.prescriptionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponse {
    private Long prescriptionId;
    private Long appointmentId;
    private Long doctorId;
    private Long patientId;
    private String diagnosis;
    private String instructions;
    private String status;
    private LocalDateTime issuedAt;
    private List<MedicineResponse> medicines;
    
    // Doctor details (populated from feign client)
    private String doctorName;
    private String doctorSpecialization;
    
    // Patient details (populated from feign client)
    private String patientName;
}
