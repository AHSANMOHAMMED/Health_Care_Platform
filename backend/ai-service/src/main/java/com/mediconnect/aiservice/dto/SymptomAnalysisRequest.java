package com.mediconnect.aiservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SymptomAnalysisRequest {
    
    @NotBlank(message = "Symptoms description is required")
    private String symptoms;
    
    @NotNull(message = "Age is required")
    private Integer age;
    
    @NotBlank(message = "Gender is required")
    private String gender;
    
    private String duration;
    private String severity;
}
