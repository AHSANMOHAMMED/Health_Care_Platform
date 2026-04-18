package com.mediconnect.notificationservice.service.sms;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {
    
    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;
    
    public void sendAppointmentReminder(String toPhone, String doctorName, String appointmentTime) {
        String message = String.format(
            "MediConnect: Reminder - You have an appointment with Dr. %s on %s. Join at: https://mediconnect.lk/telemedicine",
            doctorName, appointmentTime
        );
        sendSms(toPhone, message);
    }
    
    public void sendUrgentNotification(String toPhone, String message) {
        sendSms(toPhone, "[URGENT] MediConnect: " + message);
    }
    
    public void sendPaymentConfirmation(String toPhone, String amount, String appointmentId) {
        String message = String.format(
            "MediConnect: Payment of %s received for appointment #%s. Thank you!",
            amount, appointmentId
        );
        sendSms(toPhone, message);
    }
    
    private void sendSms(String toPhone, String body) {
        try {
            Message message = Message.creator(
                    new PhoneNumber(toPhone),
                    new PhoneNumber(fromPhoneNumber),
                    body)
                .create();
            
            log.info("SMS sent to {}. SID: {}", toPhone, message.getSid());
        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", toPhone, e.getMessage());
        }
    }
}
