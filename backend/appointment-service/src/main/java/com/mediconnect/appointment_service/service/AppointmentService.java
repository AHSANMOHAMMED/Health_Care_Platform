package com.mediconnect.appointment_service.service;

import com.mediconnect.appointment_service.config.RabbitMQConfig;
import com.mediconnect.appointment_service.dto.AppointmentRequest;
import com.mediconnect.appointment_service.entity.Appointment;
import com.mediconnect.appointment_service.entity.AppointmentStatus;
import com.mediconnect.appointment_service.event.AppointmentEvent;
import com.mediconnect.appointment_service.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    
    private final AppointmentRepository appointmentRepository;
    private final RabbitTemplate rabbitTemplate;

    public Appointment createAppointment(AppointmentRequest request) {
        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .symptoms(request.getSymptoms())
                .status(AppointmentStatus.PENDING)
                // Generate a demo jitsi meet link automatically
                .meetingLink("https://meet.jit.si/MediConnect_" + UUID.randomUUID().toString())
                .build();
                
        Appointment saved = appointmentRepository.save(appointment);
        
        // Publish Event
        AppointmentEvent event = new AppointmentEvent(
                saved.getId(), saved.getPatientId(), saved.getDoctorId(), 
                "CREATED", "New appointment booked for " + saved.getAppointmentDate()
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_QUEUE, event);
        
        return saved;
    }

    public Appointment updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        Appointment saved = appointmentRepository.save(appointment);
        
        // Publish Event
        AppointmentEvent event = new AppointmentEvent(
                saved.getId(), saved.getPatientId(), saved.getDoctorId(), 
                status.name(), "Appointment status updated to " + status.name()
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_QUEUE, event);
        
        return saved;
    }
    
    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }
    
    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
}
