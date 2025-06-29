package com.example.api.controller;

import com.example.api.dto.ApiResponse;
import com.example.api.dto.UserResponse;
import com.example.api.entity.User;
import com.example.api.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        String timestamp = LocalDateTime.now().format(formatter);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        logger.info("👥 [{}] GET ALL USERS - Requested by: {}, IP: {}", timestamp, email, getClientIP());
        
        try {
            List<UserResponse> users = userService.getAllUsers();
            logger.info("✅ [{}] GET ALL USERS SUCCESS - Count: {}, Requested by: {}", 
                timestamp, users.size(), email);
            return ResponseEntity.ok(ApiResponse.success("Liste des utilisateurs récupérée", users));
        } catch (Exception e) {
            logger.error("❌ [{}] GET ALL USERS FAILED - Requested by: {}, Error: {}", 
                timestamp, email, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        String timestamp = LocalDateTime.now().format(formatter);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        logger.info("👥 [{}] GET ALL USERS PAGINATED - Requested by: {}, IP: {}", 
            timestamp, email, getClientIP());
        
        try {
            Page<UserResponse> users = userService.getAllUsers(pageable);
            logger.info("✅ [{}] GET ALL USERS PAGINATED SUCCESS - Count: {}, Requested by: {}", 
                timestamp, users.getTotalElements(), email);
            return ResponseEntity.ok(ApiResponse.success("Liste paginée des utilisateurs récupérée", users));
        } catch (Exception e) {
            logger.error("❌ [{}] GET ALL USERS PAGINATED FAILED - Requested by: {}, Error: {}", 
                timestamp, email, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.user.id == #id")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        String timestamp = LocalDateTime.now().format(formatter);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        logger.info("👤 [{}] GET USER BY ID - ID: {}, Requested by: {}, IP: {}", 
            timestamp, id, email, getClientIP());
        
        try {
            UserResponse user = userService.getUserById(id);
            logger.info("✅ [{}] GET USER BY ID SUCCESS - ID: {}, Requested by: {}", 
                timestamp, id, email);
            return ResponseEntity.ok(ApiResponse.success("Utilisateur trouvé", user));
        } catch (Exception e) {
            logger.error("❌ [{}] GET USER BY ID FAILED - ID: {}, Requested by: {}, Error: {}", 
                timestamp, id, email, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN') or authentication.name == #email")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByEmail(@PathVariable String email) {
        UserResponse user = userService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.success("Utilisateur trouvé", user));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(@RequestParam String keyword) {
        List<UserResponse> users = userService.searchUsers(keyword);
        return ResponseEntity.ok(ApiResponse.success("Résultats de recherche", users));
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getActiveUsers() {
        List<UserResponse> users = userService.getActiveUsers();
        return ResponseEntity.ok(ApiResponse.success("Utilisateurs actifs", users));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.user.id == #id")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        UserResponse user = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(ApiResponse.success("Utilisateur mis à jour", user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        String timestamp = LocalDateTime.now().format(formatter);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        logger.info("🗑️ [{}] DELETE USER - ID: {}, Requested by: {}, IP: {}", 
            timestamp, id, email, getClientIP());
        
        try {
            userService.deleteUser(id);
            logger.info("✅ [{}] DELETE USER SUCCESS - ID: {}, Requested by: {}", 
                timestamp, id, email);
            return ResponseEntity.ok(ApiResponse.success("Utilisateur supprimé", "Utilisateur avec l'ID " + id + " supprimé"));
        } catch (Exception e) {
            logger.error("❌ [{}] DELETE USER FAILED - ID: {}, Requested by: {}, Error: {}", 
                timestamp, id, email, e.getMessage());
            throw e;
        }
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable Long id) {
        String timestamp = LocalDateTime.now().format(formatter);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        logger.info("🔄 [{}] TOGGLE USER STATUS - ID: {}, Requested by: {}, IP: {}", 
            timestamp, id, email, getClientIP());
        
        try {
            UserResponse user = userService.toggleUserStatus(id);
            logger.info("✅ [{}] TOGGLE USER STATUS SUCCESS - ID: {}, Requested by: {}", 
                timestamp, id, email);
            return ResponseEntity.ok(ApiResponse.success("Statut de l'utilisateur modifié", user));
        } catch (Exception e) {
            logger.error("❌ [{}] TOGGLE USER STATUS FAILED - ID: {}, Requested by: {}, Error: {}", 
                timestamp, id, email, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/count/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> countActiveUsers() {
        Long count = userService.countActiveUsers();
        return ResponseEntity.ok(ApiResponse.success("Nombre d'utilisateurs actifs", count));
    }

    // Méthode utilitaire pour récupérer l'IP du client
    private String getClientIP() {
        try {
            // Cette méthode devra être implémentée selon votre configuration
            // Pour l'instant, retournons une valeur par défaut
            return "unknown";
        } catch (Exception e) {
            return "unknown";
        }
    }
}
