import os

BASE_DIR = "backend/patient-service/src/main/java/com/mediconnect/patient_service"
RES_DIR = "backend/patient-service/src/main/resources"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + "\n")

# application.yml
write_file(f"{RES_DIR}/application.yml", """
server:
  port: 8082

spring:
  application:
    name: patient-service
  config:
    import: "optional:configserver:http://localhost:8888/"
  datasource:
    url: jdbc:postgresql://localhost:5432/patient_db
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

# PatientProfile.java
write_file(f"{BASE_DIR}/entity/PatientProfile.java", """
package com.mediconnect.patient_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "patient_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private Long userId; // Mapped from auth-service
    
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String bloodGroup;
    
    @Column(columnDefinition = "TEXT")
    private String medicalHistory;
}
""")

# PatientRepository.java
write_file(f"{BASE_DIR}/repository/PatientRepository.java", """
package com.mediconnect.patient_service.repository;

import com.mediconnect.patient_service.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<PatientProfile, Long> {
    Optional<PatientProfile> findByUserId(Long userId);
}
""")

# ProfileRequest.java
write_file(f"{BASE_DIR}/dto/ProfileRequest.java", """
package com.mediconnect.patient_service.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileRequest {
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String bloodGroup;
    private String medicalHistory;
}
""")

# AuthClient.java
write_file(f"{BASE_DIR}/client/AuthClient.java", """
package com.mediconnect.patient_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "auth-service")
public interface AuthClient {
    @GetMapping("/auth/validate")
    String validateToken(@RequestParam("token") String token);
}
""")

# PatientService.java
write_file(f"{BASE_DIR}/service/PatientService.java", """
package com.mediconnect.patient_service.service;

import com.mediconnect.patient_service.dto.ProfileRequest;
import com.mediconnect.patient_service.entity.PatientProfile;
import com.mediconnect.patient_service.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {
    
    private final PatientRepository patientRepository;

    public PatientProfile getProfile(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseGet(() -> {
                    PatientProfile profile = new PatientProfile();
                    profile.setUserId(userId);
                    return patientRepository.save(profile);
                });
    }

    public PatientProfile updateProfile(Long userId, ProfileRequest request) {
        PatientProfile profile = getProfile(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setBloodGroup(request.getBloodGroup());
        profile.setMedicalHistory(request.getMedicalHistory());
        return patientRepository.save(profile);
    }
}
""")

# PatientController.java
write_file(f"{BASE_DIR}/controller/PatientController.java", """
package com.mediconnect.patient_service.controller;

import com.mediconnect.patient_service.dto.ProfileRequest;
import com.mediconnect.patient_service.entity.PatientProfile;
import com.mediconnect.patient_service.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/{userId}")
    public ResponseEntity<PatientProfile> getProfile(@PathVariable Long userId, @RequestHeader(value = "Authorization", required = false) String token) {
        // Implementation with Feign validate would go mapped in an interceptor 
        // to simplify we trust GW or do manual check
        return ResponseEntity.ok(patientService.getProfile(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<PatientProfile> updateProfile(
            @PathVariable Long userId, 
            @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(patientService.updateProfile(userId, request));
    }
}
""")

# Main class
write_file(f"{BASE_DIR}/PatientServiceApplication.java", """
package com.mediconnect.patient_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class PatientServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(PatientServiceApplication.class, args);
	}
}
""")

print("Patient Service code generated successfully!")
