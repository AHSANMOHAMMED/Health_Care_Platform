package com.mediconnect.payment_service.controller;
import com.mediconnect.payment_service.entity.PaymentRecord;
import com.mediconnect.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentRepository paymentRepository;
    private final RabbitTemplate rabbitTemplate;

    @PostMapping("/notify")
    public ResponseEntity<String> handlePayhereNotify(@RequestParam("merchant_id") String merchantId,
                                       @RequestParam("order_id") String orderId,
                                       @RequestParam("payment_id") String paymentId,
                                       @RequestParam("payhere_amount") String amount,
                                       @RequestParam("payhere_currency") String currency,
                                       @RequestParam("status_code") String statusCode) {
        // "order_id" is essentially the appointment ID in our domain
        if ("2".equals(statusCode)) { // 2 = Success in PayHere
            PaymentRecord payment = PaymentRecord.builder()
                    .appointmentId(Long.parseLong(orderId))
                    .amount(new java.math.BigDecimal(amount))
                    .currency(currency)
                    .payherePaymentId(paymentId)
                    .status("SUCCESS")
                    .timestamp(LocalDateTime.now())
                    .build();
            paymentRepository.save(payment);
            
            // Publish Event
            rabbitTemplate.convertAndSend("notification_queue", 
                    "Payment Successful for Appointment " + orderId);
        }
        return ResponseEntity.ok().build();
    }
}
