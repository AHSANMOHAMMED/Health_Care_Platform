package com.mediconnect.telemedicineservice.repository;

import com.mediconnect.telemedicineservice.entity.VideoSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoSessionRepository extends JpaRepository<VideoSession, Long> {
    
    Optional<VideoSession> findByAppointmentId(Long appointmentId);
    
    Optional<VideoSession> findByRoomName(String roomName);
    
    List<VideoSession> findByDoctorIdAndStatusOrderByScheduledAtDesc(Long doctorId, String status);
    
    List<VideoSession> findByPatientIdAndStatusOrderByScheduledAtDesc(Long patientId, String status);
    
    List<VideoSession> findByDoctorIdOrderByScheduledAtDesc(Long doctorId);
    
    List<VideoSession> findByPatientIdOrderByScheduledAtDesc(Long patientId);
}
