package com.healthcare.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import reactor.core.publisher.Mono;

@Component
public class JwtGatewayFilter implements GlobalFilter, Ordered {

  private static final AntPathMatcher MATCHER = new AntPathMatcher();

  private static final List<String> PUBLIC =
      List.of(
          "/api/auth/**",
          "/actuator/**",
          "/api/payments/payhere/**",
          "/api/payments/webhooks/**",
          "/api/doctors/search",
          "/api/doctors/search/**");

  private final SecretKey key;

  public JwtGatewayFilter(@Value("${jwt.secret}") String secret) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    ServerHttpRequest request = exchange.getRequest();
    String path = request.getURI().getPath();

    if (PUBLIC.stream().anyMatch(p -> MATCHER.match(p, path))) {
      return chain.filter(exchange);
    }

    String auth = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
    if (auth == null || !auth.startsWith("Bearer ")) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }

    String token = auth.substring(7);
    try {
      Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
      String subject = claims.getSubject();
      String role = claims.get("role", String.class);
      ServerHttpRequest mutated =
          request
              .mutate()
              .header("X-User-Id", subject != null ? subject : "")
              .header("X-User-Role", role != null ? role : "")
              .build();
      return chain.filter(exchange.mutate().request(mutated).build());
    } catch (JwtException ex) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }
  }

  @Override
  public int getOrder() {
    return Ordered.HIGHEST_PRECEDENCE + 10;
  }
}
