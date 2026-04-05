package com.mediconnect.telemedicineservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.UUID;

@RestController
@RequestMapping("")
public class VideoController {

    @GetMapping("/generate-room")
    public String generateRoom() {
        return "https://meet.jit.si/mediconnect-" + UUID.randomUUID().toString();
    }
}
