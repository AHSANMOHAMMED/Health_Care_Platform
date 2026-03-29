package com.healthcare.appointment.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

  @Bean
  TopicExchange healthcareEvents(@Value("${healthcare.rabbit.exchange:healthcare.events}") String name) {
    return new TopicExchange(name, true, false);
  }
}
