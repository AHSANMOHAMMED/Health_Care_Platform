package com.mediconnect.appointmentservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    private Long doctorId;
    private LocalDateTime appointmentTime;
}
