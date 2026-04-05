import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + "\n")

############# PAYMENT SERVICE #############
PAY_DIR = "backend/payment-service/src/main/java/com/mediconnect/payment_service"
write_file("backend/payment-service/src/main/resources/application.yml", """
server:
  port: 8085
spring:
  application:
    name: payment-service
  config:
    import: "optional:configserver:http://localhost:8888/"
  datasource:
    url: jdbc:postgresql://localhost:5432/payment_db
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: update
  rabbitmq:
    host: localhost
  flyway:
    enabled: false
""")

write_file(f"{PAY_DIR}/entity/PaymentRecord.java", """
package com.mediconnect.payment_service.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long appointmentId;
    private BigDecimal amount;
    private String currency;
    private String status; // SUCCESS, FAILED
    private String payherePaymentId;
    private LocalDateTime timestamp;
}
""")

write_file(f"{PAY_DIR}/repository/PaymentRepository.java", """
package com.mediconnect.payment_service.repository;
import com.mediconnect.payment_service.entity.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentRecord, Long> {}
""")

write_file(f"{PAY_DIR}/controller/PaymentController.java", """
package com.mediconnect.payment_service.controller;
import com.mediconnect.payment_service.entity.PaymentRecord;
import com.mediconnect.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentRepository paymentRepository;
    private final RabbitTemplate rabbitTemplate;

    @PostMapping("/notify")
    public ResponseEntity<String> handlePayhereNotify(@RequestParam("merchant_id") String merchantId,
                                       @RequestParam("order_id") String orderId,
                                       @RequestParam("payment_id") String paymentId,
                                       @RequestParam("payhere_amount") String amount,
                                       @RequestParam("payhere_currency") String currency,
                                       @RequestParam("status_code") String statusCode) {
        // "order_id" is essentially the appointment ID in our domain
        if ("2".equals(statusCode)) { // 2 = Success in PayHere
            PaymentRecord payment = PaymentRecord.builder()
                    .appointmentId(Long.parseLong(orderId))
                    .amount(new java.math.BigDecimal(amount))
                    .currency(currency)
                    .payherePaymentId(paymentId)
                    .status("SUCCESS")
                    .timestamp(LocalDateTime.now())
                    .build();
            paymentRepository.save(payment);
            
            // Publish Event
            rabbitTemplate.convertAndSend("notification_queue", 
                    "Payment Successful for Appointment " + orderId);
        }
        return ResponseEntity.ok().build();
    }
}
""")
write_file(f"{PAY_DIR}/PaymentServiceApplication.java", """
package com.mediconnect.payment_service;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
@SpringBootApplication
@EnableDiscoveryClient
public class PaymentServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(PaymentServiceApplication.class, args);
	}
}
""")

############# NOTIFICATION SERVICE #############
NOTIF_DIR = "backend/notification-service/src/main/java/com/mediconnect/notification_service"
write_file("backend/notification-service/src/main/resources/application.yml", """
server:
  port: 8086
spring:
  application:
    name: notification-service
  config:
    import: "optional:configserver:http://localhost:8888/"
  rabbitmq:
    host: localhost
""")

write_file(f"{NOTIF_DIR}/listener/NotificationListener.java", """
package com.mediconnect.notification_service.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationListener {

    @RabbitListener(queues = "notification_queue")
    public void handleNotificationMessage(Object message) {
        log.info("🔔 [NOTIFICATION SERVICE] Received event: {}", message);
        // Here we would integrate Brevo API and Notify.lk SMS API
        // sendEmail(...)
        // sendSms(...)
        log.info("🔔 Sent Email and SMS for notification.");
    }
}
""")
write_file(f"{NOTIF_DIR}/NotificationServiceApplication.java", """
package com.mediconnect.notification_service;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
@SpringBootApplication
@EnableDiscoveryClient
public class NotificationServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(NotificationServiceApplication.class, args);
	}
}
""")

############# TELEMEDICINE SERVICE #############
TELE_DIR = "backend/telemedicine-service/src/main/java/com/mediconnect/telemedicine_service"
write_file("backend/telemedicine-service/src/main/resources/application.yml", """
server:
  port: 8087
spring:
  application:
    name: telemedicine-service
  config:
    import: "optional:configserver:http://localhost:8888/"
""")

write_file(f"{TELE_DIR}/controller/TelemedicineController.java", """
package com.mediconnect.telemedicine_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/telemedicine")
public class TelemedicineController {

    @GetMapping("/generate-room")
    public ResponseEntity<Map<String, String>> generateRoomId() {
        String roomId = "MediConnect_" + UUID.randomUUID().toString();
        return ResponseEntity.ok(Map.of("roomId", roomId, "domain", "meet.jit.si"));
    }
}
""")
write_file(f"{TELE_DIR}/TelemedicineServiceApplication.java", """
package com.mediconnect.telemedicine_service;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
@SpringBootApplication
@EnableDiscoveryClient
public class TelemedicineServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(TelemedicineServiceApplication.class, args);
	}
}
""")

############# AI SERVICE #############
AI_DIR = "backend/ai-service/src/main/java/com/mediconnect/ai_service"
write_file("backend/ai-service/src/main/resources/application.yml", """
server:
  port: 8088
spring:
  application:
    name: ai-service
  config:
    import: "optional:configserver:http://localhost:8888/"
  datasource:
    url: jdbc:postgresql://localhost:5432/ai_db
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: update
  flyway:
    enabled: false
""")

write_file(f"{AI_DIR}/controller/AiController.java", """
package com.mediconnect.ai_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/ai/symptom-checker")
public class AiController {

    @PostMapping
    public ResponseEntity<Map<String, String>> analyzeSymptoms(@RequestBody Map<String, String> request) {
        String symptoms = request.get("symptoms");
        // Mock Gemini Call (Normally would inject RestTemplate and call Gemini endpoint with API Key)
        String mockResponse = "Based on '" + symptoms + "', we recommend consulting a general physician. Do not self-medicate.";
        
        return ResponseEntity.ok(Map.of("analysis", mockResponse));
    }
}
""")
write_file(f"{AI_DIR}/AiServiceApplication.java", """
package com.mediconnect.ai_service;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
@SpringBootApplication
@EnableDiscoveryClient
public class AiServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(AiServiceApplication.class, args);
	}
}
""")

print("Phase 5 Services generated successfully!")
