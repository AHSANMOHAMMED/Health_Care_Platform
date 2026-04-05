package com.mediconnect.appointmentservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long patientId;
    private Long doctorId;
    
    private LocalDateTime appointmentTime;
    
    @Column(nullable = false)
    private String status; // PENDING, CONFIRMED, COMPLETED, CANCELLED
    
    private String meetingLink; // Jitsi meeting link
    
    @PrePersist
    public void generateLink() {
        if(this.meetingLink == null) {
            this.meetingLink = "https://meet.jit.si/mediconnect-" + UUID.randomUUID().toString();
        }
    }
}
