package com.mediconnect.patientservice.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private String bloodGroup;
    private LocalDate dateOfBirth;
    private String medicalHistory;
}
