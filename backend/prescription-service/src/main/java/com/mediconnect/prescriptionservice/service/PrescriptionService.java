package com.mediconnect.prescriptionservice.service;

import com.mediconnect.prescriptionservice.dto.*;
import com.mediconnect.prescriptionservice.entity.Prescription;
import com.mediconnect.prescriptionservice.entity.PrescriptionMedicine;
import com.mediconnect.prescriptionservice.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    
    private final PrescriptionRepository prescriptionRepository;
    
    @Transactional
    public PrescriptionResponse createPrescription(CreatePrescriptionRequest request) {
        Prescription prescription = Prescription.builder()
                .appointmentId(request.getAppointmentId())
                .doctorId(request.getDoctorId())
                .patientId(request.getPatientId())
                .diagnosis(request.getDiagnosis())
                .instructions(request.getInstructions())
                .status("ACTIVE")
                .build();
        
        // Add medicines
        for (MedicineRequest medReq : request.getMedicines()) {
            PrescriptionMedicine medicine = PrescriptionMedicine.builder()
                    .medicineName(medReq.getMedicineName())
                    .dosage(medReq.getDosage())
                    .frequency(medReq.getFrequency())
                    .duration(medReq.getDuration())
                    .notes(medReq.getNotes())
                    .build();
            prescription.addMedicine(medicine);
        }
        
        Prescription saved = prescriptionRepository.save(prescription);
        return mapToResponse(saved);
    }
    
    public PrescriptionResponse getPrescriptionById(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        return mapToResponse(prescription);
    }
    
    public List<PrescriptionResponse> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByIssuedAtDesc(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<PrescriptionResponse> getPrescriptionsByDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctorIdOrderByIssuedAtDesc(doctorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public PrescriptionResponse getPrescriptionByAppointment(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Prescription not found for appointment: " + appointmentId));
        return mapToResponse(prescription);
    }
    
    @Transactional
    public PrescriptionResponse updateStatus(Long id, UpdatePrescriptionStatusRequest request) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        
        prescription.setStatus(request.getStatus());
        Prescription updated = prescriptionRepository.save(prescription);
        return mapToResponse(updated);
    }
    
    private PrescriptionResponse mapToResponse(Prescription prescription) {
        List<MedicineResponse> medicines = prescription.getMedicines().stream()
                .map(med -> MedicineResponse.builder()
                        .medicineId(med.getMedicineId())
                        .medicineName(med.getMedicineName())
                        .dosage(med.getDosage())
                        .frequency(med.getFrequency())
                        .duration(med.getDuration())
                        .notes(med.getNotes())
                        .build())
                .collect(Collectors.toList());
        
        return PrescriptionResponse.builder()
                .prescriptionId(prescription.getPrescriptionId())
                .appointmentId(prescription.getAppointmentId())
                .doctorId(prescription.getDoctorId())
                .patientId(prescription.getPatientId())
                .diagnosis(prescription.getDiagnosis())
                .instructions(prescription.getInstructions())
                .status(prescription.getStatus())
                .issuedAt(prescription.getIssuedAt())
                .medicines(medicines)
                .build();
    }
}
