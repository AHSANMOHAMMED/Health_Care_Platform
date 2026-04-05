package com.mediconnect.doctor_service.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DoctorRequest {
    private String firstName;
    private String lastName;
    private String specialization;
    private String qualifications;
    private String hospitalAffiliation;
    private BigDecimal consultationFee;
    private String availableDays;
    private String availableTimeStart;
    private String availableTimeEnd;
}
