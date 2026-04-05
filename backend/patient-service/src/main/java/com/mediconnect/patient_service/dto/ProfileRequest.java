package com.mediconnect.patient_service.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileRequest {
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String bloodGroup;
    private String medicalHistory;
}
