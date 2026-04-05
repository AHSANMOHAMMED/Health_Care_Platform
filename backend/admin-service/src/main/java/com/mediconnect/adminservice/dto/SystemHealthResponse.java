package com.mediconnect.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemHealthResponse {
    private Double serverUptime;
    private Long apiResponseTime;
    private String databaseStatus;
    private Long activeConnections;
    private Double errorRate;
}

