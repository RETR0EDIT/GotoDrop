package com.example.api.controller;

import com.example.api.dto.*;
import com.example.api.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        String timestamp = LocalDateTime.now().format(formatter);
        logger.info("🔐 [{}] LOGIN ATTEMPT - Email: {}, IP: {}, User-Agent: {}", 
            timestamp, loginRequest.getEmail(), getClientIP(request), getUserAgent(request));
        
        try {
            AuthResponse authResponse = authService.login(loginRequest);
            logger.info("✅ [{}] LOGIN SUCCESS - Email: {}", timestamp, loginRequest.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Connexion réussie", authResponse));
        } catch (Exception e) {
            logger.error("❌ [{}] LOGIN FAILED - Email: {}, Error: {}", 
                timestamp, loginRequest.getEmail(), e.getMessage());
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest, HttpServletRequest request) {
        String timestamp = LocalDateTime.now().format(formatter);
        logger.info("📝 [{}] REGISTER ATTEMPT - Email: {}, Username: {}, IP: {}", 
            timestamp, registerRequest.getEmail(), registerRequest.getUsername(), getClientIP(request));
        
        try {
            AuthResponse authResponse = authService.register(registerRequest);
            logger.info("✅ [{}] REGISTER SUCCESS - Email: {}", timestamp, registerRequest.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Inscription réussie", authResponse));
        } catch (Exception e) {
            logger.error("❌ [{}] REGISTER FAILED - Email: {}, Error: {}", 
                timestamp, registerRequest.getEmail(), e.getMessage());
            throw e;
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(HttpServletRequest request) {
        String timestamp = LocalDateTime.now().format(formatter);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        logger.info("👤 [{}] GET CURRENT USER - Email: {}, IP: {}", timestamp, email, getClientIP(request));
        
        try {
            UserResponse userResponse = authService.getCurrentUser(email);
            logger.info("✅ [{}] GET CURRENT USER SUCCESS - Email: {}", timestamp, email);
            return ResponseEntity.ok(ApiResponse.success(userResponse));
        } catch (Exception e) {
            logger.error("❌ [{}] GET CURRENT USER FAILED - Email: {}, Error: {}", 
                timestamp, email, e.getMessage());
            throw e;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request) {
        String timestamp = LocalDateTime.now().format(formatter);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        logger.info("🚪 [{}] LOGOUT - Email: {}, IP: {}", timestamp, email, getClientIP(request));
        
        // Avec JWT, la déconnexion côté serveur n'est pas nécessaire
        // Le client doit simplement supprimer le token
        return ResponseEntity.ok(ApiResponse.success("Déconnexion réussie", "Token invalidé côté client"));
    }

    // Méthodes utilitaires pour récupérer les informations de la requête
    private String getClientIP(HttpServletRequest request) {
        try {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
                return xForwardedFor.split(",")[0].trim();
            }
            
            String xRealIP = request.getHeader("X-Real-IP");
            if (xRealIP != null && !xRealIP.isEmpty() && !"unknown".equalsIgnoreCase(xRealIP)) {
                return xRealIP;
            }
            
            return request.getRemoteAddr();
        } catch (Exception e) {
            return "unknown";
        }
    }

    private String getUserAgent(HttpServletRequest request) {
        try {
            String userAgent = request.getHeader("User-Agent");
            return userAgent != null ? userAgent : "unknown";
        } catch (Exception e) {
            return "unknown";
        }
    }
}
