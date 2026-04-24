package com.mediconnect.authservice.repository;

import com.mediconnect.authservice.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByToken(String token);

    void deleteByExpiryDateBefore(LocalDateTime expiryDate);

    void deleteByUserId(Long userId);
}
