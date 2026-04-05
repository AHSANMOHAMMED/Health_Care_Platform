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
