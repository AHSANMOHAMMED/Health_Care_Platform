package com.mediconnect.paymentservice.controller;

import com.mediconnect.paymentservice.dto.CreatePaymentIntentRequest;
import com.mediconnect.paymentservice.dto.CreatePaymentIntentResponse;
import com.mediconnect.paymentservice.entity.Transaction;
import com.mediconnect.paymentservice.repository.TransactionRepository;
import com.mediconnect.paymentservice.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final TransactionRepository transactionRepository;
    private final StripeService stripeService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${stripe.api.webhook-secret:}")
    private String webhookSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String APPOINTMENT_URL = "http://mediconnect-appointment-service:8080";

    // ==================== Stripe Integration ====================

    @PostMapping("/create-intent")
    public ResponseEntity<CreatePaymentIntentResponse> createPaymentIntent(
            @RequestHeader("X-UserId") Long patientId,
            @Valid @RequestBody CreatePaymentIntentRequest request) {
        try {
            CreatePaymentIntentResponse response = stripeService.createPaymentIntent(patientId, request);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            log.error("Failed to create payment intent: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            
            log.info("Received Stripe webhook: {}", event.getType());

            switch (event.getType()) {
                case "payment_intent.succeeded":
                    PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
                    if (paymentIntent != null) {
                        stripeService.handlePaymentSuccess(paymentIntent.getId());
                        
                        // Update appointment status
                        String appointmentId = paymentIntent.getMetadata().get("appointmentId");
                        confirmAppointment(Long.valueOf(appointmentId));
                        
                        // Send notification
                        rabbitTemplate.convertAndSend("mediconnect_exchange", "notification_routing_key", 
                            "Payment successful for appointment #" + appointmentId);
                    }
                    break;
                    
                case "payment_intent.payment_failed":
                    PaymentIntent failedIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
                    if (failedIntent != null) {
                        String failureMessage = failedIntent.getLastPaymentError() != null 
                            ? failedIntent.getLastPaymentError().getMessage() 
                            : "Payment failed";
                        stripeService.handlePaymentFailure(failedIntent.getId(), failureMessage);
                    }
                    break;
            }
            
            return ResponseEntity.ok("Received");
        } catch (Exception e) {
            log.error("Webhook error: {}", e.getMessage());
            return ResponseEntity.status(400).body("Webhook error: " + e.getMessage());
        }
    }

    @GetMapping("/transactions/patient/{patientId}")
    public ResponseEntity<List<Transaction>> getPatientTransactions(@PathVariable Long patientId) {
        List<Transaction> transactions = transactionRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<Transaction> getTransaction(@PathVariable Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return ResponseEntity.ok(transaction);
    }

    // ==================== Legacy Endpoints ====================

    @PostMapping("/notify")
    public ResponseEntity<String> payhereWebhook(@RequestParam Map<String, String> payload) {
        String orderId = payload.get("order_id");
        String statusCode = payload.get("status_code");
        
        Transaction tx = transactionRepository.findByPayhereOrderId(orderId)
                .orElse(new Transaction());
        tx.setPayhereOrderId(orderId);
        tx.setStatus(statusCode != null && statusCode.equals("2") ? "SUCCESS" : "FAILED");
        transactionRepository.save(tx);
        
        if ("SUCCESS".equals(tx.getStatus())) {
            rabbitTemplate.convertAndSend("mediconnect_exchange", "notification_routing_key", "Payment successful for order: " + orderId);
        }
        
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/mock-success")
    public ResponseEntity<Transaction> mockSuccess(
            @RequestHeader("X-UserId") Long patientId,
            @RequestParam Long appointmentId, 
            @RequestParam Double amount) {
            
        Transaction tx = Transaction.builder()
                .patientId(patientId)
                .appointmentId(appointmentId)
                .amount(amount)
                .currency("LKR")
                .status("SUCCESS")
                .build();
        
        Transaction saved = transactionRepository.save(tx);
        
        rabbitTemplate.convertAndSend("mediconnect_exchange", "notification_routing_key", "Payment of LKR " + amount + " successful for Appt " + appointmentId);
        
        // Finalize missing webhook appointment linkage logic natively
        try {
            confirmAppointment(appointmentId);
            rabbitTemplate.convertAndSend("mediconnect_exchange", "notification_routing_key", "Your Appointment #" + appointmentId + " is CONFIRMED.");
        } catch (Exception e) {
            System.err.println("Could not reach appointment service to update status: " + e.getMessage());
        }

        return ResponseEntity.ok(saved);
    }

    // ==================== Private Methods ====================

    private void confirmAppointment(Long appointmentId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("status", "CONFIRMED");

            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
            restTemplate.patchForObject(APPOINTMENT_URL + "/api/appointments/" + appointmentId + "/status", 
                requestEntity, String.class);
        } catch (Exception e) {
            log.error("Could not confirm appointment {}: {}", appointmentId, e.getMessage());
        }
    }
}
