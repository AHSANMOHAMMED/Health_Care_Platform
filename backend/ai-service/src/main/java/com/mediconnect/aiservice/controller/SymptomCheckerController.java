package com.mediconnect.aiservice.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class SymptomCheckerController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @PostMapping("/symptom-checker")
    public ResponseEntity<String> checkSymptoms(@RequestBody Map<String, String> payload) {
        String query = payload.get("symptoms");
        
        if(geminiApiKey == null || "mock_key".equals(geminiApiKey) || geminiApiKey.contains("insert-key-here")) {
            return ResponseEntity.ok("AI Analysis (Mock Mode): Based on your symptoms ('" + query + "'), please consult a professional.");
        }
        
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;
        String requestBody = "{\"contents\":[{\"parts\":[{\"text\":\"Analyze symptoms: " + query + "\"}]}]}";
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.postForEntity(url, requestBody, String.class);
        } catch(Exception e) {
            return ResponseEntity.internalServerError().body("Failed: " + e.getMessage());
        }
    }
}
