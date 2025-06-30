package com.example.api.controller;

import com.example.api.dto.UserResponse;
import com.example.api.entity.Role;
import com.example.api.entity.User;
import com.example.api.service.UserService;
import com.example.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // Obtenir les statistiques des utilisateurs
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        try {
            long totalUsers = userRepository.count();
            long adminCount = userRepository.countByRole(Role.ADMIN);
            long userCount = userRepository.countByRole(Role.USER);

            Map<String, Object> stats = Map.of(
                    "totalUsers", totalUsers,
                    "adminCount", adminCount,
                    "userCount", userCount);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Obtenir tous les utilisateurs (admin uniquement)
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        try {
            List<UserResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtenir tous les admins
    @GetMapping("/admins")
    public ResponseEntity<List<UserResponse>> getAllAdmins() {
        try {
            List<User> admins = userRepository.findByRole(Role.ADMIN);
            List<UserResponse> adminResponses = admins.stream()
                    .map(user -> {
                        UserResponse response = new UserResponse();
                        response.setId(user.getId());
                        response.setUsername(user.getUsername());
                        response.setEmail(user.getEmail());
                        response.setFirstName(user.getFirstName());
                        response.setLastName(user.getLastName());
                        response.setRoles(user.getRoles());
                        response.setIsActive(user.getIsActive());
                        response.setCreatedAt(user.getCreatedAt());
                        response.setUpdatedAt(user.getUpdatedAt());
                        return response;
                    })
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(adminResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Promouvoir un utilisateur en admin
    @PutMapping("/users/{id}/promote")
    public ResponseEntity<Map<String, String>> promoteUser(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            user.setRole(Role.ADMIN);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Utilisateur promu administrateur avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Rétrograder un admin en utilisateur
    @PutMapping("/users/{id}/demote")
    public ResponseEntity<Map<String, String>> demoteAdmin(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Vérifier qu'il reste au moins un admin
            if (user.getRole() == Role.ADMIN && userRepository.countByRole(Role.ADMIN) <= 1) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Impossible de rétrograder le dernier administrateur"));
            }

            user.setRole(Role.USER);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Administrateur rétrogradé utilisateur avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Créer un compte admin
    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, String>> createAdmin(@RequestBody Map<String, String> adminData) {
        try {
            String username = adminData.get("username");
            String email = adminData.get("email");
            String password = adminData.get("password");

            if (username == null || email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tous les champs sont obligatoires"));
            }

            User admin = userService.createAdmin(username, email, password);
            return ResponseEntity
                    .ok(Map.of("message", "Compte administrateur créé avec succès", "id", admin.getId().toString()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
