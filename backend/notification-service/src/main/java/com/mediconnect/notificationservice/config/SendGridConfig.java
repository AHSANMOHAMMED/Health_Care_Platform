package com.mediconnect.notificationservice.config;

import com.sendgrid.SendGrid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class SendGridConfig {
    
    @Value("${sendgrid.api-key:}")
    private String apiKey;
    
    @Value("${sendgrid.enabled:false}")
    private boolean enabled;
    
    @Bean
    public SendGrid sendGridClient() {
        if (!enabled || apiKey == null || apiKey.isEmpty()) {
            log.warn("SendGrid is disabled or API key not configured");
            return null;
        }
        log.info("SendGrid client initialized");
        return new SendGrid(apiKey);
    }
}
