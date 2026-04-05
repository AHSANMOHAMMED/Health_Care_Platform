package com.mediconnect.paymentservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long patientId;
    private Long appointmentId;
    
    private Double amount;
    private String currency;
    
    private String payhereOrderId;
    private String status;
    
    private LocalDateTime timestamp = LocalDateTime.now();
}
