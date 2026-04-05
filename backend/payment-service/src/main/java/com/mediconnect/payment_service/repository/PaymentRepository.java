package com.mediconnect.payment_service.repository;
import com.mediconnect.payment_service.entity.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentRecord, Long> {}
