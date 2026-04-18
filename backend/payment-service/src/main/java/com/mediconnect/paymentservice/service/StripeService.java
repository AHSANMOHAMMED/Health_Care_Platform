package com.mediconnect.paymentservice.service;

import com.mediconnect.paymentservice.dto.CreatePaymentIntentRequest;
import com.mediconnect.paymentservice.dto.CreatePaymentIntentResponse;
import com.mediconnect.paymentservice.entity.Transaction;
import com.mediconnect.paymentservice.repository.TransactionRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeService {
    
    private final TransactionRepository transactionRepository;
    
    @Transactional
    public CreatePaymentIntentResponse createPaymentIntent(Long patientId, CreatePaymentIntentRequest request) throws StripeException {
        // Create pending transaction
        Transaction transaction = Transaction.builder()
                .patientId(patientId)
                .appointmentId(request.getAppointmentId())
                .doctorId(request.getDoctorId())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .status("PENDING")
                .description(request.getDescription())
                .build();
        
        Transaction saved = transactionRepository.save(transaction);
        
        // Create Stripe PaymentIntent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (request.getAmount() * 100)) // Convert to cents
                .setCurrency(request.getCurrency().toLowerCase())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .putMetadata("transactionId", saved.getId().toString())
                .putMetadata("appointmentId", request.getAppointmentId().toString())
                .putMetadata("patientId", patientId.toString())
                .putMetadata("doctorId", request.getDoctorId().toString())
                .build();
        
        PaymentIntent intent = PaymentIntent.create(params);
        
        // Update transaction with Stripe IDs
        saved.setStripePaymentIntentId(intent.getId());
        saved.setStatus("PROCESSING");
        transactionRepository.save(saved);
        
        return CreatePaymentIntentResponse.builder()
                .clientSecret(intent.getClientSecret())
                .paymentIntentId(intent.getId())
                .transactionId(saved.getId())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .status(intent.getStatus())
                .build();
    }
    
    @Transactional
    public void handlePaymentSuccess(String paymentIntentId) throws StripeException {
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
        
        Transaction transaction = transactionRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Transaction not found for payment intent: " + paymentIntentId));
        
        transaction.setStatus("SUCCESS");
        transaction.setPaidAt(java.time.LocalDateTime.now());
        // Receipt URL will be set from webhook or charge object
        if (intent.getLatestCharge() != null) {
            // In production, retrieve charge to get receipt_url
            transaction.setReceiptUrl("https://dashboard.stripe.com/receipts/" + intent.getLatestCharge());
        }
        
        transactionRepository.save(transaction);
        
        log.info("Payment successful for transaction: {}, amount: {} {}",
                transaction.getId(), transaction.getCurrency(), transaction.getAmount());
    }
    
    @Transactional
    public void handlePaymentFailure(String paymentIntentId, String failureMessage) {
        Transaction transaction = transactionRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Transaction not found for payment intent: " + paymentIntentId));
        
        transaction.setStatus("FAILED");
        transaction.setFailureReason(failureMessage);
        
        transactionRepository.save(transaction);
        
        log.error("Payment failed for transaction: {}, reason: {}",
                transaction.getId(), failureMessage);
    }
}
