package com.mediconnect.prescriptionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineResponse {
    private Long medicineId;
    private String medicineName;
    private String dosage;
    private String frequency;
    private String duration;
    private String notes;
}
