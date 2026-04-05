package com.mediconnect.adminservice.service;

import com.mediconnect.adminservice.dto.ActivityResponse;
import com.mediconnect.adminservice.dto.AdminStatsResponse;
import com.mediconnect.adminservice.dto.SystemHealthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.Arrays;

/**
 * AdminService provides aggregated metrics for the admin dashboard.
 * This is a mock implementation that can be extended to fetch real data from other services via Feign clients.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    public AdminStatsResponse getStats(String period) {
        // Mock implementation - in production, fetch from patient/doctor/appointment/payment services via Feign
        return AdminStatsResponse.builder()
                .totalPatients(1204L)
                .totalDoctors(95L)
                .verifiedDoctors(85L)
                .pendingDoctorVerifications(10L)
                .totalAppointments(3456L)
                .todayAppointments(42L)
                .completedAppointments(3100L)
                .cancelledAppointments(356L)
                .totalRevenue(2450000L)
                .monthlyRevenue(385000L)
                .activeUsers(234L)
                .newUsersThisMonth(89L)
                .build();
    }

    public List<ActivityResponse> getRecentActivity() {
        // Mock implementation - in production, fetch from audit logs or event store
        return Arrays.asList(
                ActivityResponse.builder()
                        .id(1L)
                        .type("user_register")
                        .description("New patient registration: John Smith")
                        .timestamp(Instant.now().minusSeconds(300).toString())
                        .status("success")
                        .build(),
                ActivityResponse.builder()
                        .id(2L)
                        .type("doctor_verify")
                        .description("Doctor verification request: Dr. Sarah Johnson")
                        .timestamp(Instant.now().minusSeconds(600).toString())
                        .status("pending")
                        .build(),
                ActivityResponse.builder()
                        .id(3L)
                        .type("appointment_book")
                        .description("Appointment booked: Cardiology consultation")
                        .timestamp(Instant.now().minusSeconds(900).toString())
                        .status("success")
                        .build(),
                ActivityResponse.builder()
                        .id(4L)
                        .type("payment_complete")
                        .description("Payment completed: LKR 3,500")
                        .timestamp(Instant.now().minusSeconds(1200).toString())
                        .status("success")
                        .build()
        );
    }

    public SystemHealthResponse getSystemHealth() {
        // Mock implementation - in production, check actual service health and database status
        return SystemHealthResponse.builder()
                .serverUptime(99.9)
                .apiResponseTime(145L)
                .databaseStatus("healthy")
                .activeConnections(45L)
                .errorRate(0.2)
                .build();
    }
}

