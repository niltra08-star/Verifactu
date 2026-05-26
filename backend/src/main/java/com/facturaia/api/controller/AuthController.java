package com.facturaia.api.controller;

import com.facturaia.api.dto.AuthResponse;
import com.facturaia.api.dto.LoginRequest;
import com.facturaia.api.dto.RegisterRequest;
import com.facturaia.api.model.WaitlistEntry;
import com.facturaia.api.repository.WaitlistRepository;
import com.facturaia.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final WaitlistRepository waitlistRepository;

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/auth/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/auth/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Long usuarioId = authService.validarToken(token);
            if (usuarioId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Token invalido"));
            }
            return ResponseEntity.ok(Map.of("usuarioId", usuarioId, "valido", true));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token invalido"));
        }
    }

    @PostMapping("/public/waitlist")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> subscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String source = body.getOrDefault("source", "landing_page");

        if (email == null || email.isBlank() || !email.contains("@")) {
            return Map.of("success", false, "error", "Email invalido");
        }

        try {
            if (waitlistRepository.existsByEmail(email.toLowerCase().trim())) {
                return Map.of("success", true, "message", "Ya estabas en la lista");
            }

            WaitlistEntry entry = WaitlistEntry.builder()
                    .email(email.toLowerCase().trim())
                    .source(source)
                    .build();
            waitlistRepository.save(entry);

            return Map.of("success", true, "message", "Registrado en la lista de espera",
                    "total", waitlistRepository.count());
        } catch (Exception e) {
            return Map.of("success", false, "error", "Error al guardar");
        }
    }
}

