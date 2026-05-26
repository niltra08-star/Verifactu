package com.facturaia.api.service;

import com.facturaia.api.dto.AuthResponse;
import com.facturaia.api.dto.LoginRequest;
import com.facturaia.api.dto.RegisterRequest;
import com.facturaia.api.model.Usuario;
import com.facturaia.api.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${facturaia.jwt.secret:changeme-in-production-use-env-var}")
    private String jwtSecret;

    @Value("${facturaia.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya esta registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .nif(request.getNif())
                .direccion(request.getDireccion())
                .ciudad(request.getCiudad())
                .provincia(request.getProvincia())
                .activo(true)
                .build();

        usuario = usuarioRepository.save(usuario);
        log.info("Usuario registrado: {} (id={})", usuario.getEmail(), usuario.getId());

        String token = generarToken(usuario);

        return AuthResponse.builder()
                .token(token)
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .usuarioId(usuario.getId())
                .tipo("Bearer")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Email o contrasena incorrectos"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new RuntimeException("Email o contrasena incorrectos");
        }

        if (!usuario.getActivo()) {
            throw new RuntimeException("Cuenta desactivada. Contacta con soporte.");
        }

        log.info("Login exitoso: {} (id={})", usuario.getEmail(), usuario.getId());
        String token = generarToken(usuario);

        return AuthResponse.builder()
                .token(token)
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .usuarioId(usuario.getId())
                .tipo("Bearer")
                .build();
    }

    public Long validarToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(Base64.getEncoder().encodeToString(
                    jwtSecret.getBytes(StandardCharsets.UTF_8)).getBytes(StandardCharsets.UTF_8));

            var claims = Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Long.parseLong(claims.getSubject());
        } catch (Exception e) {
            log.debug("Token JWT invalido: {}", e.getMessage());
            return null;
        }
    }

    private String generarToken(Usuario usuario) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .subject(usuario.getId().toString())
                .claim("email", usuario.getEmail())
                .claim("nombre", usuario.getNombre())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }
}
