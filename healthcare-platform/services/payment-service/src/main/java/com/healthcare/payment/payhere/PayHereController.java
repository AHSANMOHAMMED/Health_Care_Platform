package com.healthcare.payment.payhere;

import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments/payhere")
@RequiredArgsConstructor
public class PayHereController {

  private final PayHereService payHereService;

  @PostMapping("/checkout-params")
  public Map<String, String> checkout(
      @RequestParam String orderId,
      @RequestParam BigDecimal amount,
      @RequestParam(defaultValue = "LKR") String currency,
      @RequestParam String returnUrl,
      @RequestParam String cancelUrl,
      @RequestParam String notifyUrl) {
    return payHereService.buildHostedCheckoutFields(orderId, amount, currency, returnUrl, cancelUrl, notifyUrl);
  }

  @PostMapping("/notify")
  public ResponseEntity<String> notify(HttpServletRequest request) {
    Map<String, String> params = new LinkedHashMap<>();
    Enumeration<String> names = request.getParameterNames();
    while (names.hasMoreElements()) {
      String n = names.nextElement();
      params.put(n, request.getParameter(n));
    }
    boolean ok = payHereService.validateNotify(params);
    return ok ? ResponseEntity.ok("OK") : ResponseEntity.badRequest().body("INVALID");
  }
}
