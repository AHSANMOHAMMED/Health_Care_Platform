package com.healthcare.doctor.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record AvailabilityRequest(@NotEmpty @Valid List<Slot> slots) {
  public record Slot(String startAt, String endAt) {}
}
