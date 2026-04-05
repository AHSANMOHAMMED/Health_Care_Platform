package com.mediconnect.adminservice.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSummary {
    private Long totalDoctors;
    private Long verifiedDoctors;
    private Long pendingVerifications;
}

