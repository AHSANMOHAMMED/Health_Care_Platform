package com.mediconnect.paymentservice.repository;

import com.mediconnect.paymentservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
