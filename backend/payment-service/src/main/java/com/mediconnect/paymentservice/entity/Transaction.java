package com.mediconnect.paymentservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long patientId;
    private Long appointmentId;
    private Long doctorId;
    
    private Double amount;
    private String currency;
    
    // PayHere fields (legacy)
    private String payhereOrderId;
    
    // Stripe fields
    private String stripePaymentIntentId;
    private String stripePaymentMethodId;
    private String stripeCustomerId;
    
    // Transaction status
    @Builder.Default
    private String status = "PENDING"; // PENDING, PROCESSING, SUCCESS, FAILED, REFUNDED
    
    private String failureReason;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime paidAt;
    private LocalDateTime refundedAt;
    
    // Metadata
    private String description;
    private String receiptUrl;
}
