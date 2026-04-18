package com.mediconnect.notificationservice.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediconnect.notificationservice.service.email.EmailService;
import com.mediconnect.notificationservice.service.sms.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RabbitMQListener {

    private final EmailService emailService;
    private final SmsService smsService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "notification_queue")
    public void listen(String message) {
        log.info("=========================================");
        log.info("NOTIFICATION SERVICE RECEIVED EVENT");
        log.info("Payload: {}", message);

        try {
            // Try to parse as JSON for structured events
            Map<String, Object> event = objectMapper.readValue(message, new TypeReference<Map<String, Object>>() {});
            String eventType = (String) event.getOrDefault("type", "GENERIC");
            
            switch (eventType) {
                case "APPOINTMENT_CONFIRMED":
                    handleAppointmentConfirmation(event);
                    break;
                case "PAYMENT_SUCCESS":
                    handlePaymentSuccess(event);
                    break;
                case "PRESCRIPTION_ISSUED":
                    handlePrescriptionIssued(event);
                    break;
                case "APPOINTMENT_REMINDER":
                    handleAppointmentReminder(event);
                    break;
                default:
                    // Fallback to simple text routing
                    handleGenericNotification(message);
            }
        } catch (Exception e) {
            // If JSON parsing fails, treat as simple text
            handleGenericNotification(message);
        }
        log.info("=========================================");
    }

    private void handleAppointmentConfirmation(Map<String, Object> event) {
        String email = (String) event.get("patientEmail");
        String phone = (String) event.get("patientPhone");
        String patientName = (String) event.get("patientName");
        String doctorName = (String) event.get("doctorName");
        String date = (String) event.get("appointmentDate");
        String time = (String) event.get("appointmentTime");
        String meetingUrl = (String) event.get("meetingUrl");
        
        if (email != null) {
            emailService.sendAppointmentConfirmation(email, patientName, doctorName, date, time, meetingUrl);
        }
        if (phone != null) {
            smsService.sendAppointmentReminder(phone, doctorName, time);
        }
    }

    private void handlePaymentSuccess(Map<String, Object> event) {
        String email = (String) event.get("patientEmail");
        String phone = (String) event.get("patientPhone");
        String patientName = (String) event.get("patientName");
        String amount = (String) event.get("amount");
        String appointmentId = (String) event.get("appointmentId");
        
        if (email != null) {
            emailService.sendPaymentConfirmation(email, patientName, amount, appointmentId);
        }
        if (phone != null) {
            smsService.sendPaymentConfirmation(phone, amount, appointmentId);
        }
    }

    private void handlePrescriptionIssued(Map<String, Object> event) {
        String email = (String) event.get("patientEmail");
        String patientName = (String) event.get("patientName");
        String doctorName = (String) event.get("doctorName");
        
        if (email != null) {
            emailService.sendPrescriptionNotification(email, patientName, doctorName);
        }
    }

    private void handleAppointmentReminder(Map<String, Object> event) {
        String email = (String) event.get("patientEmail");
        String phone = (String) event.get("patientPhone");
        String patientName = (String) event.get("patientName");
        String doctorName = (String) event.get("doctorName");
        String time = (String) event.get("appointmentTime");
        
        if (email != null) {
            emailService.sendAppointmentReminder(email, patientName, doctorName, time);
        }
        if (phone != null) {
            smsService.sendAppointmentReminder(phone, doctorName, time);
        }
    }

    private void handleGenericNotification(String message) {
        if (message.toLowerCase().contains("urgent") || message.toLowerCase().contains("appointment")) {
            log.info("[SMS Mock] Would send SMS for urgent/appointment message");
        } else {
            log.info("[Email Mock] Would send Email for generic message");
        }
    }
}
