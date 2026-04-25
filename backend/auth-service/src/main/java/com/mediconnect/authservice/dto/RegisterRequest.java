package com.mediconnect.authservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterRequest {
    private String email;
    private String password;
    private String role;
    private String firstName;
    private String lastName;
    
    // Additional Profile Fields (accepted during signup to prevent errors)
    private String nic;
    private String dob;
    private String gender;
    private String phone;
    private String address;
    private String district;
    private String province;
    private String specialization;
    private String licenseNumber;
    private String qualifications;
    private String hospitalAffiliation;
    private String bloodType;
}
