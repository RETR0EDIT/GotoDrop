package com.example.api.controller;

import com.example.api.dto.UserResponse;
import com.example.api.entity.Role;
import com.example.api.entity.User;
import com.example.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" }, allowCredentials = "true")
public class AuthController {

    private static final String TOKEN_PREFIX = "fake-jwt-token-";
    private static final String TOKEN_KEY = "token";

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Pour la validation du mot de passe, nous devons récupérer l'entité User
            User user = userService.getUserEntityByEmail(loginRequest.getEmail());

            // Vérifier le mot de passe (en production, utilisez BCrypt)
            if (!user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Email ou mot de passe incorrect"));
            } // Créer la réponse de succès
            String userToken = TOKEN_PREFIX + user.getId();
            Map<String, Object> userData = Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole().toString(),
                    TOKEN_KEY, userToken);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Connexion réussie");
            response.put("data", Map.of(
                    "user", userData,
                    TOKEN_KEY, userToken));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la connexion"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // Vérifier si l'email existe déjà
            if (userService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Cet email est déjà utilisé"));
            }

            // Vérifier si le nom d'utilisateur existe déjà
            if (userService.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Ce nom d'utilisateur est déjà pris"));
            }

            // Créer un nouvel utilisateur
            User newUser = new User();
            newUser.setUsername(registerRequest.getUsername());
            newUser.setEmail(registerRequest.getEmail());
            newUser.setPassword(registerRequest.getPassword()); // En production, hasher le mot de passe
            newUser.setRole(Role.USER);

            User createdUser = userService.createUser(newUser);

            String userToken = TOKEN_PREFIX + createdUser.getId();
            Map<String, Object> userData = Map.of(
                    "id", createdUser.getId(),
                    "username", createdUser.getUsername(),
                    "email", createdUser.getEmail(),
                    "role", createdUser.getRole().toString(),
                    TOKEN_KEY, userToken);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Inscription réussie");
            response.put("data", Map.of(
                    "user", userData,
                    TOKEN_KEY, userToken));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de l'inscription"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Token manquant ou invalide"));
            }

            String token = authHeader.substring(7); // Enlever "Bearer "

            // Extraire l'ID utilisateur du token simple (format: fake-jwt-token-{id})
            if (!token.startsWith(TOKEN_PREFIX)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Token invalide"));
            }

            String userIdStr = token.substring(TOKEN_PREFIX.length());
            Long userId;
            try {
                userId = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Token invalide"));
            }

            try {
                User user = userService.getUserEntityById(userId);
                Map<String, Object> userData = Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "role", user.getRole().toString());

                return ResponseEntity.ok(userData);
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Utilisateur non trouvé"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la vérification du token"));
        }
    }

    // Classes internes pour les requêtes
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
