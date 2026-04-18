package com.mediconnect.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePaymentIntentResponse {
    private String clientSecret;
    private String paymentIntentId;
    private Long transactionId;
    private Double amount;
    private String currency;
    private String status;
}
