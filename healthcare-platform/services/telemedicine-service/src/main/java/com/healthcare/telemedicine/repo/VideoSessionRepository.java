package com.healthcare.telemedicine.repo;

import com.healthcare.telemedicine.domain.VideoSession;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoSessionRepository extends JpaRepository<VideoSession, UUID> {}
