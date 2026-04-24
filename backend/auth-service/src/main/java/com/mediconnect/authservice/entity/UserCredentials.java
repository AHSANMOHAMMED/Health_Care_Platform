package com.mediconnect.authservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_credentials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCredentials {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String role; // PATIENT, DOCTOR, ADMIN

    private String firstName;
    private String lastName;
    
    @Column(nullable = false)
    private String status; // APPROVED, PENDING, REJECTED

    @Column(nullable = false)
    private Boolean emailVerified = false;
}
