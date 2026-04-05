import os

BASE_DIR = "backend/doctor-service/src/main/java/com/mediconnect/doctor_service"
RES_DIR = "backend/doctor-service/src/main/resources"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + "\n")

# application.yml
write_file(f"{RES_DIR}/application.yml", """
server:
  port: 8083

spring:
  application:
    name: doctor-service
  config:
    import: "optional:configserver:http://localhost:8888/"
  datasource:
    url: jdbc:postgresql://localhost:5432/doctor_db
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  flyway:
    enabled: false
""")

# DoctorProfile.java
write_file(f"{BASE_DIR}/entity/DoctorProfile.java", """
package com.mediconnect.doctor_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "doctor_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private Long userId; // Mapped from auth-service
    
    private String firstName;
    private String lastName;
    private String specialization;
    
    @Column(columnDefinition = "TEXT")
    private String qualifications;
    
    private String hospitalAffiliation;
    private BigDecimal consultationFee;
    
    private String availableDays; // e.g., "MON,WED,FRI"
    private String availableTimeStart; // e.g., "09:00"
    private String availableTimeEnd; // e.g., "17:00"
}
""")

# DoctorRepository.java
write_file(f"{BASE_DIR}/repository/DoctorRepository.java", """
package com.mediconnect.doctor_service.repository;

import com.mediconnect.doctor_service.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface DoctorRepository extends JpaRepository<DoctorProfile, Long> {
    Optional<DoctorProfile> findByUserId(Long userId);
    List<DoctorProfile> findBySpecializationContainingIgnoreCase(String specialization);
}
""")

# DoctorRequest.java
write_file(f"{BASE_DIR}/dto/DoctorRequest.java", """
package com.mediconnect.doctor_service.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DoctorRequest {
    private String firstName;
    private String lastName;
    private String specialization;
    private String qualifications;
    private String hospitalAffiliation;
    private BigDecimal consultationFee;
    private String availableDays;
    private String availableTimeStart;
    private String availableTimeEnd;
}
""")

# DoctorService.java
write_file(f"{BASE_DIR}/service/DoctorService.java", """
package com.mediconnect.doctor_service.service;

import com.mediconnect.doctor_service.dto.DoctorRequest;
import com.mediconnect.doctor_service.entity.DoctorProfile;
import com.mediconnect.doctor_service.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {
    
    private final DoctorRepository doctorRepository;

    public DoctorProfile getProfile(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseGet(() -> {
                    DoctorProfile profile = new DoctorProfile();
                    profile.setUserId(userId);
                    return doctorRepository.save(profile);
                });
    }

    public DoctorProfile updateProfile(Long userId, DoctorRequest request) {
        DoctorProfile profile = getProfile(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setSpecialization(request.getSpecialization());
        profile.setQualifications(request.getQualifications());
        profile.setHospitalAffiliation(request.getHospitalAffiliation());
        profile.setConsultationFee(request.getConsultationFee());
        profile.setAvailableDays(request.getAvailableDays());
        profile.setAvailableTimeStart(request.getAvailableTimeStart());
        profile.setAvailableTimeEnd(request.getAvailableTimeEnd());
        return doctorRepository.save(profile);
    }
    
    public List<DoctorProfile> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public List<DoctorProfile> searchBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
    }
}
""")

# DoctorController.java
write_file(f"{BASE_DIR}/controller/DoctorController.java", """
package com.mediconnect.doctor_service.controller;

import com.mediconnect.doctor_service.dto.DoctorRequest;
import com.mediconnect.doctor_service.entity.DoctorProfile;
import com.mediconnect.doctor_service.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<DoctorProfile>> getAllDoctors(@RequestParam(required = false) String specialization) {
        if (specialization != null) {
            return ResponseEntity.ok(doctorService.searchBySpecialization(specialization));
        }
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<DoctorProfile> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(doctorService.getProfile(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<DoctorProfile> updateProfile(
            @PathVariable Long userId, 
            @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(doctorService.updateProfile(userId, request));
    }
}
""")

# Main class
write_file(f"{BASE_DIR}/DoctorServiceApplication.java", """
package com.mediconnect.doctor_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class DoctorServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(DoctorServiceApplication.class, args);
	}
}
""")

print("Doctor Service code generated successfully!")
