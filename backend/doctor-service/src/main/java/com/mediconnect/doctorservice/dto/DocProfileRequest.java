package com.mediconnect.doctorservice.dto;

import lombok.Data;

@Data
public class DocProfileRequest {
    private String firstName;
    private String lastName;
    private String specialization;
    private Double consultationFee;
    private String qualifications;
    private String availabilitySlots;
}
