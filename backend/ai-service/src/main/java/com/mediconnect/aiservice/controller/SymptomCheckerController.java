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
    public ResponseEntity<Map<String, Object>> checkSymptoms(@RequestBody Map<String, String> payload) {
        String query = payload.get("symptoms");
        
        if(geminiApiKey == null || "mock_key".equals(geminiApiKey) || geminiApiKey.contains("insert-key-here")) {
            return ResponseEntity.ok(Map.of("analysis", "AI Analysis (Mock Mode): Based on your symptoms ('" + query + "'), please consult a professional."));
        }
        
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;
        String prompt = "You are a professional medical AI assistant for the MediConnect Lanka platform. " +
                       "Analyze the following symptoms provided by a patient in Sri Lanka. " +
                       "Symptoms: " + query + ". " +
                       "Provide a structured response including: " +
                       "1. Professional Assessment (Analysis) " +
                       "2. Urgency Level (LOW, MEDIUM, HIGH, CRITICAL) " +
                       "3. Recommended Medical Specialty (e.g., Cardiologist, Neurologist) " +
                       "4. Next Steps. " +
                       "Keep it concise and clinical. DISCLAIMER: Always mention this is not a substitute for a real doctor.";
        
        String requestBody = "{\"contents\":[{\"parts\":[{\"text\":\"" + prompt + "\"}]}]}";
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestBody, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                java.util.List candidates = (java.util.List) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    java.util.List parts = (java.util.List) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String text = (String) ((Map) parts.get(0)).get("text");
                        return ResponseEntity.ok(Map.of("analysis", text));
                    }
                }
            }
            return ResponseEntity.ok(Map.of("analysis", "AI Analysis: No response from model."));
        } catch(Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed: " + e.getMessage()));
        }
    }
}
