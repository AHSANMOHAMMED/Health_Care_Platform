package com.mediconnect.adminservice.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentSummary {
    private Long totalAppointments;
    private Long todayAppointments;
    private Long completedAppointments;
    private Long cancelledAppointments;
}

