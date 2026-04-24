package com.mediconnect.authservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne(targetEntity = UserCredentials.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private UserCredentials user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private boolean used = false;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}
