package com.mediconnect.notificationservice.config;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class TwilioConfig {
    
    @Value("${twilio.account-sid:}")
    private String accountSid;
    
    @Value("${twilio.auth-token:}")
    private String authToken;
    
    @Value("${twilio.enabled:false}")
    private boolean enabled;
    
    @PostConstruct
    public void init() {
        if (!enabled || accountSid == null || accountSid.isEmpty() || authToken == null || authToken.isEmpty()) {
            log.warn("Twilio is disabled or credentials not configured");
            return;
        }
        Twilio.init(accountSid, authToken);
        log.info("Twilio client initialized");
    }
}
