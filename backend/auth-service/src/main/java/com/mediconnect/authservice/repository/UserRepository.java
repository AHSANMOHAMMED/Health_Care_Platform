package com.mediconnect.authservice.repository;

import com.mediconnect.authservice.entity.UserCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserCredentials, Long> {
    Optional<UserCredentials> findByEmail(String email);
}
