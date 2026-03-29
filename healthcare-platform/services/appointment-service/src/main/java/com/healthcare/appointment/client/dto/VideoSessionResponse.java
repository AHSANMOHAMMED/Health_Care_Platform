package com.healthcare.appointment.client.dto;

public record VideoSessionResponse(
    String appId, String channel, String token, long uid, String message) {}
