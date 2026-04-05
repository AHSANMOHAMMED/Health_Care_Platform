package com.mediconnect.apigateway.security;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            if (validator.isSecured.test(exchange.getRequest())) {
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    return onError(exchange, "Missing authorization header", HttpStatus.UNAUTHORIZED);
                }

                String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7);
                }

                try {
                    if (!jwtUtil.isTokenValid(authHeader)) {
                        return onError(exchange, "Invalid token", HttpStatus.UNAUTHORIZED);
                    }

                    // Extract user details and pass them in headers for microservices
                    Claims claims = jwtUtil.getAllClaimsFromToken(authHeader);
                    String userId = claims.getSubject();
                    String role = claims.get("role", String.class);

                    ServerHttpRequest request = exchange.getRequest().mutate()
                            .header("X-UserId", userId)
                            .header("X-UserRole", role)
                            .build();

                    return chain.filter(exchange.mutate().request(request).build());

                } catch (Exception e) {
                    System.out.println("Invalid access...!");
                    return onError(exchange, "Unauthorized access", HttpStatus.UNAUTHORIZED);
                }
            }
            return chain.filter(exchange);
        });
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    public static class Config {
    }
}
