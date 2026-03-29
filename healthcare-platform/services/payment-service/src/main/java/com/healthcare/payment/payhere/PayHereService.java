package com.healthcare.payment.payhere;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * PayHere documented hash: {@code md5(merchant_id + order_id + amount + currency + md5(merchant_secret))}
 * Always confirm against official PayHere API docs for your integration type (Checkout vs Charging API).
 */
@Service
@RequiredArgsConstructor
public class PayHereService {

  @Value("${payhere.merchant-id:}")
  private String merchantId;

  @Value("${payhere.merchant-secret:}")
  private String merchantSecret;

  @Value("${payhere.sandbox:true}")
  private boolean sandbox;

  public Map<String, String> buildHostedCheckoutFields(
      String orderId, BigDecimal amount, String currency, String returnUrl, String cancelUrl, String notifyUrl) {
    if (merchantId.isBlank() || merchantSecret.isBlank()) {
      throw new IllegalStateException("Configure PAYHERE_MERCHANT_ID and PAYHERE_MERCHANT_SECRET");
    }
    String amountFormatted = amount.toPlainString();
    String md5Secret = DigestUtils.md5Hex(merchantSecret.getBytes(StandardCharsets.UTF_8)).toUpperCase();
    String hashRaw = merchantId + orderId + amountFormatted + currency + md5Secret;
    String hash = DigestUtils.md5Hex(hashRaw.getBytes(StandardCharsets.UTF_8)).toUpperCase();

    Map<String, String> fields = new LinkedHashMap<>();
    fields.put("merchant_id", merchantId);
    fields.put("return_url", returnUrl);
    fields.put("cancel_url", cancelUrl);
    fields.put("notify_url", notifyUrl);
    fields.put("order_id", orderId);
    fields.put("items", "Consultation");
    fields.put("currency", currency);
    fields.put("amount", amountFormatted);
    fields.put("hash", hash);
    fields.put(
        "sandbox",
        sandbox ? "1" : "0"); // PayHERE sandbox flag depends on integration; keep configurable in properties.
    return fields;
  }

  /** Validate notify callback hash from PayHere form posts. */
  public boolean validateNotify(Map<String, String> params) {
    String received = params.getOrDefault("checksum", params.get("md5sig"));
    if (received == null) return false;
    String local =
        DigestUtils.md5Hex(
                (params.getOrDefault("merchant_id", "")
                        + params.getOrDefault("order_id", "")
                        + params.getOrDefault("payhere_amount", params.getOrDefault("amount", ""))
                        + params.getOrDefault("payhere_currency", params.getOrDefault("currency", ""))
                        + DigestUtils.md5Hex(merchantSecret.getBytes(StandardCharsets.UTF_8)).toUpperCase()))
            .toUpperCase();
    return received.equalsIgnoreCase(local);
  }

  public String debugConcat(Map<String, String> fields) {
    return fields.entrySet().stream().map(e -> e.getKey() + "=" + e.getValue()).collect(Collectors.joining("&"));
  }
}
