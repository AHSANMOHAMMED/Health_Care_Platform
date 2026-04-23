package com.mediconnect.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediconnect.aiservice.dto.SymptomAnalysisRequest;
import com.mediconnect.aiservice.dto.SymptomAnalysisResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    @Value("${gemini.api.key:mock-key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String GEMINI_URL = 
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public SymptomAnalysisResponse analyzeSymptoms(SymptomAnalysisRequest request) {
        // Check if using mock mode
        if (isMockMode()) {
            log.info("Using mock AI response");
            return buildMockResponse(request.getSymptoms());
        }

        try {
            String prompt = buildMedicalPrompt(request);
            
            // Build request body
            StringBuilder requestBody = new StringBuilder("{\"contents\":[{\"parts\":[");
            requestBody.append(String.format("{\"text\":\"%s\"}", escapeJson(prompt)));
            
            if (request.getImage() != null && !request.getImage().isEmpty()) {
                String base64Data = request.getImage();
                String mimeType = "image/jpeg"; // Default
                
                if (base64Data.contains(";base64,")) {
                    String[] parts = base64Data.split(";base64,");
                    mimeType = parts[0].replace("data:", "");
                    base64Data = parts[1];
                }
                
                requestBody.append(String.format(",{\"inlineData\":{\"mimeType\":\"%s\",\"data\":\"%s\"}}", 
                    mimeType, base64Data));
            }
            
            requestBody.append("]}]}");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey);

            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                GEMINI_URL,
                entity,
                String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return parseGeminiResponse(response.getBody());
            } else {
                log.error("Gemini API error: {}. Status: {}", response.getBody(), response.getStatusCode());
                return buildErrorResponse();
            }
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            return buildErrorResponse();
        }
    }

    private boolean isMockMode() {
        return apiKey == null || apiKey.equals("mock-key") || 
               apiKey.contains("insert-key-here") || apiKey.isBlank();
    }

    private String buildMedicalPrompt(SymptomAnalysisRequest request) {
        String languageName = "English";
        if ("si".equalsIgnoreCase(request.getLanguage())) languageName = "Sinhala";
        else if ("ta".equalsIgnoreCase(request.getLanguage())) languageName = "Tamil";

        return String.format(
            "You are a medical AI assistant. Analyze the following symptoms and provide a structured response in %s language:\n\n" +
            "Patient: %d year old %s\n" +
            "Symptoms: %s\n" +
            "Duration: %s\n" +
            "Severity: %s\n\n" +
            "Provide a response in this exact format (but translate the values to %s):\n" +
            "ANALYSIS: [brief assessment of possible conditions - not a diagnosis]\n" +
            "SPECIALTY: [recommended medical specialty to consult - e.g., Cardiology, Dermatology, General Medicine, Neurology, Orthopedics, Psychiatry, etc.]\n" +
            "URGENCY: [LOW, MEDIUM, HIGH, or EMERGENCY]\n" +
            "ACTIONS: [3-5 suggested immediate actions, separated by | ]\n" +
            "CONDITIONS: [3-5 possible conditions, separated by | ]\n\n" +
            "Add a medical disclaimer that this is not a diagnosis.",
            languageName,
            request.getAge(),
            request.getGender(),
            request.getSymptoms(),
            request.getDuration() != null ? request.getDuration() : "Not specified",
            request.getSeverity() != null ? request.getSeverity() : "Not specified",
            languageName
        );
    }

    private SymptomAnalysisResponse parseGeminiResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Parse the structured text response
            String analysis = extractField(text, "ANALYSIS");
            String specialty = extractField(text, "SPECIALTY");
            String urgency = extractField(text, "URGENCY");
            String actions = extractField(text, "ACTIONS");
            String conditions = extractField(text, "CONDITIONS");

            return SymptomAnalysisResponse.builder()
                    .analysis(analysis.isEmpty() ? text : analysis)
                    .recommendedSpecialty(specialty.isEmpty() ? "General Medicine" : specialty)
                    .urgencyLevel(urgency.isEmpty() ? "MEDIUM" : urgency.toUpperCase())
                    .suggestedActions(parseList(actions))
                    .possibleConditions(parseList(conditions))
                    .disclaimer("This is an AI-generated preliminary assessment and not a medical diagnosis. Please consult with a qualified healthcare professional for proper diagnosis and treatment.")
                    .build();
        } catch (Exception e) {
            log.error("Error parsing Gemini response: {}", e.getMessage());
            return buildErrorResponse();
        }
    }

    private String extractField(String text, String fieldName) {
        String pattern = fieldName + ":\\s*(.+?)(?=\\n|$|ANALYSIS:|SPECIALTY:|URGENCY:|ACTIONS:|CONDITIONS:)";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern, java.util.regex.Pattern.DOTALL | java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Matcher m = p.matcher(text);
        if (m.find()) {
            return m.group(1).trim();
        }
        return "";
    }

    private List<String> parseList(String text) {
        if (text == null || text.isEmpty()) {
            return Arrays.asList("Consult a doctor for proper diagnosis");
        }
        return Arrays.asList(text.split("\\s*\\|\\s*"));
    }

    private SymptomAnalysisResponse buildMockResponse(String symptoms) {
        return SymptomAnalysisResponse.builder()
                .analysis("Based on your symptoms ('" + symptoms + "'), this appears to be a general health concern that requires professional medical evaluation.")
                .recommendedSpecialty("General Medicine")
                .urgencyLevel("MEDIUM")
                .suggestedActions(Arrays.asList(
                    "Monitor your symptoms",
                    "Stay hydrated and rest",
                    "Consult a doctor if symptoms worsen",
                    "Keep a symptom diary"
                ))
                .possibleConditions(Arrays.asList(
                    "General viral infection",
                    "Stress-related symptoms",
                    "Requires professional diagnosis"
                ))
                .disclaimer("This is a mock AI response for testing. Please consult with a qualified healthcare professional for proper diagnosis and treatment.")
                .build();
    }

    private SymptomAnalysisResponse buildErrorResponse() {
        return SymptomAnalysisResponse.builder()
                .analysis("Unable to process symptoms at this time. Please try again later or consult a healthcare professional directly.")
                .recommendedSpecialty("General Medicine")
                .urgencyLevel("MEDIUM")
                .suggestedActions(Arrays.asList("Contact a doctor directly"))
                .possibleConditions(Arrays.asList("Unable to determine"))
                .disclaimer("System error. Please consult with a qualified healthcare professional.")
                .build();
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}
