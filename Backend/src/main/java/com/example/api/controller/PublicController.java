package com.example.api.controller;

import com.example.api.dto.ApiResponse;
import com.example.api.entity.Role;
import com.example.api.entity.User;
import com.example.api.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicController {

    private static final Logger logger = LoggerFactory.getLogger(PublicController.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/init-data")
    public ResponseEntity<ApiResponse<String>> initializeData(HttpServletRequest request) {
        String timestamp = LocalDateTime.now().format(formatter);
        logger.info("🗄️ [{}] INIT DATA ATTEMPT - IP: {}", timestamp, getClientIP(request));
        
        try {
            // Créer un utilisateur admin par défaut si il n'existe pas
            if (!userRepository.existsByEmail("admin@gotodrop.com")) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@gotodrop.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setFirstName("Admin");
                adminUser.setLastName("GotoDrop");
                adminUser.setIsActive(true);
                adminUser.setRoles(Set.of(Role.ADMIN, Role.USER));
                
                userRepository.save(adminUser);
                logger.info("✅ [{}] ADMIN USER CREATED - Email: admin@gotodrop.com", timestamp);
            } else {
                logger.info("ℹ️ [{}] ADMIN USER ALREADY EXISTS - Email: admin@gotodrop.com", timestamp);
            }

            // Créer un utilisateur test si il n'existe pas
            if (!userRepository.existsByEmail("test@gotodrop.com")) {
                User testUser = new User();
                testUser.setUsername("testuser");
                testUser.setEmail("test@gotodrop.com");
                testUser.setPassword(passwordEncoder.encode("password"));
                testUser.setFirstName("Test");
                testUser.setLastName("User");
                testUser.setIsActive(true);
                testUser.setRoles(Set.of(Role.USER));
                
                userRepository.save(testUser);
                logger.info("✅ [{}] TEST USER CREATED - Email: test@gotodrop.com", timestamp);
            } else {
                logger.info("ℹ️ [{}] TEST USER ALREADY EXISTS - Email: test@gotodrop.com", timestamp);
            }

            logger.info("✅ [{}] INIT DATA SUCCESS", timestamp);
            return ResponseEntity.ok(ApiResponse.success("Données initialisées avec succès", 
                "Utilisateurs par défaut créés"));
                
        } catch (Exception e) {
            logger.error("❌ [{}] INIT DATA FAILED - Error: {}", timestamp, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Erreur lors de l'initialisation des données: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck(HttpServletRequest request) {
        String timestamp = LocalDateTime.now().format(formatter);
        logger.info("🏥 [{}] HEALTH CHECK - IP: {}", timestamp, getClientIP(request));
        
        try {
            logger.info("✅ [{}] HEALTH CHECK SUCCESS", timestamp);
            return ResponseEntity.ok(ApiResponse.success("API GotoDrop opérationnelle", "OK"));
        } catch (Exception e) {
            logger.error("❌ [{}] HEALTH CHECK FAILED - Error: {}", timestamp, e.getMessage());
            throw e;
        }
    }

    // Méthode utilitaire pour récupérer l'IP du client
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
}
