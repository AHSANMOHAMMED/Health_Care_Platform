package com.mediconnect.adminservice.controller;

import com.mediconnect.adminservice.dto.ActivityResponse;
import com.mediconnect.adminservice.dto.AdminStatsResponse;
import com.mediconnect.adminservice.dto.SystemHealthResponse;
import com.mediconnect.adminservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * AdminController provides endpoints for admin dashboard analytics and metrics.
 * All endpoints return aggregated data from across the platform.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * GET /api/admin/stats
     * Returns platform-wide statistics (patients, doctors, appointments, revenue)
     * 
     * @param period Optional filter: "24h" (default), "7d", or "30d"
     * @return AdminStatsResponse with aggregated metrics
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats(@RequestParam(defaultValue = "7d") String period) {
        return ResponseEntity.ok(adminService.getStats(period));
    }

    /**
     * GET /api/admin/activity
     * Returns recent platform activity (user registrations, verifications, bookings, payments)
     * 
     * @return List of ActivityResponse objects, sorted by most recent first
     */
    @GetMapping("/activity")
    public ResponseEntity<List<ActivityResponse>> getRecentActivity() {
        return ResponseEntity.ok(adminService.getRecentActivity());
    }

    /**
     * GET /api/admin/system-health
     * Returns system health metrics (uptime, response time, database status, connections, error rate)
     * 
     * @return SystemHealthResponse with current system status
     */
    @GetMapping("/system-health")
    public ResponseEntity<SystemHealthResponse> getSystemHealth() {
        return ResponseEntity.ok(adminService.getSystemHealth());
    }
}

