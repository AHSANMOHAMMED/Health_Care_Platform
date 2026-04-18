package com.mediconnect.paymentservice.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class StripeConfig {
    
    @Value("${stripe.api.secret-key:}")
    private String apiKey;
    
    @Value("${stripe.enabled:false}")
    private boolean enabled;
    
    @PostConstruct
    public void init() {
        if (!enabled || apiKey == null || apiKey.isEmpty()) {
            log.warn("Stripe is disabled or API key not configured. Payment service running in mock mode.");
            return;
        }
        Stripe.apiKey = apiKey;
        log.info("Stripe client initialized successfully");
    }
}
