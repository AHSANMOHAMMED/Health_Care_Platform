package com.mediconnect.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    private Long totalPatients;
    private Long totalDoctors;
    private Long verifiedDoctors;
    private Long pendingDoctorVerifications;
    private Long totalAppointments;
    private Long todayAppointments;
    private Long completedAppointments;
    private Long cancelledAppointments;
    private Long totalRevenue;
    private Long monthlyRevenue;
    private Long activeUsers;
    private Long newUsersThisMonth;
}

