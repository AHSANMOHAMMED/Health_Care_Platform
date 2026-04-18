package com.mediconnect.paymentservice.repository;

import com.mediconnect.paymentservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByStripePaymentIntentId(String paymentIntentId);
    
    Optional<Transaction> findByPayhereOrderId(String orderId);
    
    List<Transaction> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    
    List<Transaction> findByAppointmentId(Long appointmentId);
}
