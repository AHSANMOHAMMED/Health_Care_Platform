package com.mediconnect.adminservice.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientSummary {
    private Long totalPatients;
    private Long activePatients;
    private Long newThisMonth;
}

