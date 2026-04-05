package com.mediconnect.paymentservice.controller;

import com.mediconnect.paymentservice.entity.Transaction;
import com.mediconnect.paymentservice.repository.TransactionRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("")
public class PaymentController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String APPOINTMENT_URL = "http://mediconnect-appointment-service:8080";

    @PostMapping("/notify")
    public ResponseEntity<String> payhereWebhook(@RequestParam Map<String, String> payload) {
        String orderId = payload.get("order_id");
        String statusCode = payload.get("status_code");
        
        Transaction tx = new Transaction();
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
            
        Transaction tx = new Transaction();
        tx.setPatientId(patientId);
        tx.setAppointmentId(appointmentId);
        tx.setAmount(amount);
        tx.setCurrency("LKR");
        tx.setStatus("SUCCESS");
        
        Transaction saved = transactionRepository.save(tx);
        
        rabbitTemplate.convertAndSend("mediconnect_exchange", "notification_routing_key", "Payment of LKR " + amount + " successful for Appt " + appointmentId);
        
        // Finalize missing webhook appointment linkage logic natively
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("status", "CONFIRMED");

            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

            restTemplate.patchForObject(APPOINTMENT_URL + "/" + appointmentId + "/status", requestEntity, String.class);
            rabbitTemplate.convertAndSend("mediconnect_exchange", "notification_routing_key", "Your Appointment #" + appointmentId + " is CONFIRMED.");
        } catch (Exception e) {
            System.err.println("Could not reach appointment service to update status: " + e.getMessage());
        }

        return ResponseEntity.ok(saved);
    }
}
