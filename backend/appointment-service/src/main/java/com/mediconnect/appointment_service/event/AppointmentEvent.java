package com.mediconnect.appointment_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentEvent implements Serializable {
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private String status;
    private String message;
}
