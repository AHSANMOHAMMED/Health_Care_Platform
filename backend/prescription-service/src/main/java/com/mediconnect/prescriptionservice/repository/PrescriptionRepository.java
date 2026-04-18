package com.mediconnect.prescriptionservice.repository;

import com.mediconnect.prescriptionservice.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    
    List<Prescription> findByPatientIdOrderByIssuedAtDesc(Long patientId);
    
    List<Prescription> findByDoctorIdOrderByIssuedAtDesc(Long doctorId);
    
    Optional<Prescription> findByAppointmentId(Long appointmentId);
    
    @Query("SELECT p FROM Prescription p WHERE p.patientId = :patientId AND p.status = 'ACTIVE'")
    List<Prescription> findActiveByPatientId(Long patientId);
    
    long countByDoctorId(Long doctorId);
    
    long countByPatientId(Long patientId);
}
