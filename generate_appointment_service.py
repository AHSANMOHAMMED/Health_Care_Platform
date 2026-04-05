import os

BASE_DIR = "backend/appointment-service/src/main/java/com/mediconnect/appointment_service"
RES_DIR = "backend/appointment-service/src/main/resources"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + "\n")

# application.yml
write_file(f"{RES_DIR}/application.yml", """
server:
  port: 8084

spring:
  application:
    name: appointment-service
  config:
    import: "optional:configserver:http://localhost:8888/"
  datasource:
    url: jdbc:postgresql://localhost:5432/appointment_db
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  rabbitmq:
    host: localhost
    port: 5672
    username: ${RMQ_USER:guest}
    password: ${RMQ_PASSWORD:guest}
  flyway:
    enabled: false
""")

# Appointment.java
write_file(f"{BASE_DIR}/entity/Appointment.java", """
package com.mediconnect.appointment_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;

@Entity
@Table(name = "appointments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long patientId;
    
    @Column(nullable = false)
    private Long doctorId;
    
    @Column(nullable = false)
    private LocalDate appointmentDate;
    
    @Column(nullable = false)
    private LocalTime appointmentTime;
    
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;
    
    private String meetingLink;
    private String symptoms;
}
""")

# AppointmentStatus.java
write_file(f"{BASE_DIR}/entity/AppointmentStatus.java", """
package com.mediconnect.appointment_service.entity;

public enum AppointmentStatus {
    PENDING, CONFIRMED, COMPLETED, CANCELLED
}
""")

# AppointmentRepository.java
write_file(f"{BASE_DIR}/repository/AppointmentRepository.java", """
package com.mediconnect.appointment_service.repository;

import com.mediconnect.appointment_service.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
}
""")

# AppointmentRequest.java
write_file(f"{BASE_DIR}/dto/AppointmentRequest.java", """
package com.mediconnect.appointment_service.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String symptoms;
}
""")

# AppointmentEvent.java
write_file(f"{BASE_DIR}/event/AppointmentEvent.java", """
package com.mediconnect.appointment_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentEvent implements Serializable {
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private String status;
    private String message;
}
""")

# RabbitMQConfig.java
write_file(f"{BASE_DIR}/config/RabbitMQConfig.java", """
package com.mediconnect.appointment_service.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String NOTIFICATION_QUEUE = "notification_queue";

    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE, true);
    }
}
""")

# AppointmentService.java
write_file(f"{BASE_DIR}/service/AppointmentService.java", """
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
""")

# AppointmentController.java
write_file(f"{BASE_DIR}/controller/AppointmentController.java", """
package com.mediconnect.appointment_service.controller;

import com.mediconnect.appointment_service.dto.AppointmentRequest;
import com.mediconnect.appointment_service.entity.Appointment;
import com.mediconnect.appointment_service.entity.AppointmentStatus;
import com.mediconnect.appointment_service.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.createAppointment(request));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doctorId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }
}
""")

# Main class
write_file(f"{BASE_DIR}/AppointmentServiceApplication.java", """
package com.mediconnect.appointment_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class AppointmentServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(AppointmentServiceApplication.class, args);
	}
}
""")

print("Appointment Service code generated successfully!")
