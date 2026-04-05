package com.mediconnect.adminservice.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSummary {
    private Long totalRevenue;
    private Long monthlyRevenue;
    private Long transactionCount;
}

