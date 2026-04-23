package com.mediconnect.apigateway.security;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // Endpoints that do not require Authentication
    public static final List<String> openApiEndpoints = List.of(
            "/auth/register",
            "/auth/login",
            "/api/auth/register",
            "/api/auth/login",
            "/api/ai",
            "/api/payments/webhook",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}
