package com.mediconnect.appointmentservice.controller;

import com.mediconnect.appointmentservice.config.RabbitMQConfig;
import com.mediconnect.appointmentservice.dto.BookingRequest;
import com.mediconnect.appointmentservice.entity.Appointment;
import com.mediconnect.appointmentservice.repository.AppointmentRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * DTO for Doctor Statistics
     */
    @Data
    @AllArgsConstructor
    public static class DoctorStatsResponse {
        private Long totalAppointments;
        private Long pendingAppointments;
        private Long completedAppointments;
        private Long todayAppointments;
    }

    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(
            @RequestHeader("X-UserId") Long patientId,
            @RequestBody BookingRequest request) {
            
        Appointment appointment = new Appointment();
        appointment.setPatientId(patientId);
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setStatus("PENDING");
        
        Appointment saved = appointmentRepository.save(appointment);
        
        // Emit Async Event to Notification Service
        String message = "New Appointment ID " + saved.getId() + " created for Patient " + patientId;
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY, message);
        
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/patient")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@RequestHeader("X-UserId") Long patientId) {
        return ResponseEntity.ok(appointmentRepository.findByPatientId(patientId));
    }
    
    @GetMapping("/doctor")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@RequestHeader("X-UserId") Long doctorId) {
        return ResponseEntity.ok(appointmentRepository.findByDoctorId(doctorId));
    }

    /**
     * GET /doctor/{doctorId}/appointments
     * Fetch all appointments for a specific doctor
     */
    @GetMapping("/doctor/{doctorId}/appointments")
    public ResponseEntity<List<Appointment>> getDoctorAppointmentsByPath(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentRepository.findByDoctorId(doctorId));
    }

    /**
     * GET /doctor/{doctorId}/stats
     * Fetch statistics for a doctor's appointments
     */
    @GetMapping("/doctor/{doctorId}/stats")
    public ResponseEntity<DoctorStatsResponse> getDoctorStats(@PathVariable Long doctorId) {
        List<Appointment> allAppointments = appointmentRepository.findByDoctorId(doctorId);
        
        Long totalAppointments = (long) allAppointments.size();
        Long pendingAppointments = allAppointments.stream()
                .filter(a -> "PENDING".equals(a.getStatus()))
                .count();
        Long completedAppointments = allAppointments.stream()
                .filter(a -> "COMPLETED".equals(a.getStatus()))
                .count();
        
        // Count appointments for today
        Long todayAppointments = allAppointments.stream()
                .filter(a -> a.getAppointmentTime() != null &&
                        a.getAppointmentTime().toLocalDate().equals(LocalDate.now()))
                .count();
        
        return ResponseEntity.ok(new DoctorStatsResponse(
                totalAppointments,
                pendingAppointments,
                completedAppointments,
                todayAppointments
        ));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable @org.springframework.lang.NonNull Long id, @RequestBody StatusUpdateRequest request) {
        Optional<Appointment> existing = appointmentRepository.findById(java.util.Objects.requireNonNull(id));
        if (existing.isPresent()) {
            Appointment appointment = existing.get();
            String newStatus = request.getStatus().toUpperCase();
            appointment.setStatus(newStatus);
            
            if ("CONFIRMED".equals(newStatus)) {
                appointment.setPaidAt(java.time.LocalDateTime.now());
                appointment.setPaid(true);
            }
            
            Appointment updated = appointmentRepository.save(appointment);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * DTO for status update requests
     */
    @Data
    public static class StatusUpdateRequest {
        private String status;
    }
}
