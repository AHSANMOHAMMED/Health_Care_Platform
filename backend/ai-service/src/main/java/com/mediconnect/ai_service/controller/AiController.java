package com.mediconnect.ai_service.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai/symptom-checker")
public class AiController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @PostMapping
    public ResponseEntity<Map<String, String>> analyzeSymptoms(@RequestBody Map<String, String> request) {
        String symptoms = request.get("symptoms");
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", "You are a professional medical AI assistant. Analyze these symptoms safely, recommend if they should see a doctor, and keep it under 3 sentences: " + symptoms)
                ))
            ));
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            Map<String, Object> body = response.getBody();
            if(body != null && body.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                String textResponse = (String) parts.get(0).get("text");
                return ResponseEntity.ok(Map.of("analysis", textResponse));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("analysis", "Based on '" + symptoms + "', we recommend consulting a general physician immediately. (API Fallback)"));
        }
        
        return ResponseEntity.status(500).body(Map.of("analysis", "Error analyzing symptoms."));
    }
}
