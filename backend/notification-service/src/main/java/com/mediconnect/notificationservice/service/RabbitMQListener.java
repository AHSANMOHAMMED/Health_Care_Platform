package com.mediconnect.notificationservice.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RabbitMQListener {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMQListener.class);

    @RabbitListener(queues = "notification_queue")
    public void listen(String message) {
        logger.info("=========================================");
        logger.info("NOTIFICATION SERVICE RECEIVED EVENT");
        logger.info("Payload: {}", message);

        try {
            // Simulating Twilio SDK routing
            if (message.toLowerCase().contains("urgent") || message.toLowerCase().contains("appointment")) {
                sendSmsMock("+1234567890", message);
            } else {
                sendEmailMock("patient@example.com", "MediConnect Notification", message);
            }
        } catch (Exception e) {
            logger.error("Failed to dispatch notification: {}", e.getMessage());
        }
        logger.info("=========================================");
    }

    private void sendSmsMock(String phoneNumber, String body) {
        // Here we would normally use: Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        // Message.creator(new PhoneNumber(phoneNumber), new PhoneNumber(FROM_NUMBER), body).create();
        logger.info("[Twilio Integration] Sending SMS to {}: {}", phoneNumber, body);
    }

    private void sendEmailMock(String to, String subject, String body) {
        // Here we would normally use SendGrid SDK or JavaMailSender
        logger.info("[SendGrid Integration] Sending Email to {} | Subject: {}", to, subject);
    }
}
