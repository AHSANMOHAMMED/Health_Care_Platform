package com.mediconnect.payment_service.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long appointmentId;
    private BigDecimal amount;
    private String currency;
    private String status; // SUCCESS, FAILED
    private String payherePaymentId;
    private LocalDateTime timestamp;
}
