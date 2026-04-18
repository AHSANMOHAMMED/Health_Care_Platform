package com.mediconnect.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SymptomAnalysisResponse {
    private String analysis;
    private String recommendedSpecialty;
    private String urgencyLevel;
    private List<String> suggestedActions;
    private String disclaimer;
    private List<String> possibleConditions;
}
