package com.healthcare.doctor.client;

import com.healthcare.doctor.client.dto.UserReportSummary;
import java.util.List;
import java.util.UUID;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "userService", url = "${clients.user-service-url}")
public interface UserServiceClient {

  @GetMapping("/internal/v1/patients/{userId}/reports")
  List<UserReportSummary> listReports(@PathVariable("userId") UUID userId);
}
