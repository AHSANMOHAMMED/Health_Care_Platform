package com.healthcare.ai.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
@RequestMapping("/api/ai")
public class AiController {

  private final ObjectMapper mapper = new ObjectMapper();

  @Value("${openai.api-key:}")
  private String apiKey;

  public record SymptomRequest(String symptoms) {}

  @PostMapping("/symptom-check")
  @PreAuthorize("hasRole('PATIENT')")
  public Object symptom(@RequestBody SymptomRequest req) throws Exception {
    if (apiKey == null || apiKey.isBlank()) {
      return ruleBased(req.symptoms());
    }
    Map<String, Object> body = new HashMap<>();
    body.put("model", "gpt-4o-mini");
    body.put(
        "messages",
        List.of(
            Map.of(
                "role",
                "system",
                "content",
                "Return JSON only: {\"summary\":\"...\",\"recommendedSpecialties\":[\"...\"]} not diagnosis"),
            Map.of("role", "user", "content", req.symptoms())));

    String json =
        RestClient.create()
            .post()
            .uri("https://api.openai.com/v1/chat/completions")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .body(mapper.writeValueAsString(body))
            .retrieve()
            .body(String.class);

    JsonNode root = mapper.readTree(json);
    String content = root.path("choices").path(0).path("message").path("content").asText();
    return mapper.readTree(content);
  }

  private Map<String, Object> ruleBased(String symptoms) {
    String s = symptoms.toLowerCase();
    List<String> specs =
        List.of(
            s.contains("chest") || s.contains("heart") ? "Cardiology" : "",
            s.contains("head") ? "Neurology" : "",
            s.contains("skin") ? "Dermatology" : "");
    List<String> cleaned = specs.stream().filter(x -> !x.isBlank()).distinct().toList();
    if (cleaned.isEmpty()) cleaned = List.of("General Practice");
    return Map.of(
        "summary",
        "Heuristic triage only — consult a clinician.",
        "recommendedSpecialties",
        cleaned);
  }
}
