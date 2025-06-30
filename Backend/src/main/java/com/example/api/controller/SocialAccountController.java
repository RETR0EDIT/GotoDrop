package com.example.api.controller;

import com.example.api.entity.SocialAccount;
import com.example.api.entity.User;
import com.example.api.service.SocialAccountService;
import com.example.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/social-accounts")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" }, allowCredentials = "true")
public class SocialAccountController {

    @Autowired
    private SocialAccountService socialAccountService;

    @Autowired
    private UserService userService;

    // POST /api/social-accounts/link - Lier des comptes sociaux après connexion
    // Google
    @PostMapping("/link")
    public ResponseEntity<?> linkSocialAccounts(@RequestBody LinkSocialAccountsRequest request) {
        try {
            // Trouver l'utilisateur par email (dans un vrai système, utiliser le token JWT)
            User user = userService.getUserEntityByEmail(request.getUserEmail());

            // Lier les comptes sociaux
            List<SocialAccount> linkedAccounts = socialAccountService.linkMultipleSocialAccounts(
                    user,
                    request.getSocialAccounts());

            return ResponseEntity.ok(Map.of(
                    "message", "Comptes sociaux liés avec succès",
                    "linkedAccounts", linkedAccounts,
                    "totalAccounts", linkedAccounts.size()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la liaison des comptes"));
        }
    }

    // GET /api/social-accounts/user/{userId} - Obtenir les comptes sociaux d'un
    // utilisateur
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserSocialAccounts(@PathVariable Long userId) {
        try {
            User user = userService.getUserEntityById(userId);

            List<SocialAccount> accounts = socialAccountService.getUserSocialAccounts(user);

            return ResponseEntity.ok(Map.of(
                    "socialAccounts", accounts,
                    "totalAccounts", accounts.size()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la récupération des comptes"));
        }
    }

    // PUT /api/social-accounts/{id} - Mettre à jour un compte social
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSocialAccount(@PathVariable Long id, @RequestBody SocialAccount accountDetails) {
        try {
            SocialAccount updatedAccount = socialAccountService.updateSocialAccount(id, accountDetails);
            return ResponseEntity.ok(Map.of(
                    "message", "Compte social mis à jour",
                    "account", updatedAccount));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/social-accounts/{id} - Supprimer un compte social
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSocialAccount(@PathVariable Long id) {
        try {
            socialAccountService.deleteSocialAccount(id);
            return ResponseEntity.ok(Map.of("message", "Compte social supprimé"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Classes internes pour les requêtes
    public static class LinkSocialAccountsRequest {
        private String userEmail;
        private List<SocialAccountService.SocialAccountRequest> socialAccounts;

        public String getUserEmail() {
            return userEmail;
        }

        public void setUserEmail(String userEmail) {
            this.userEmail = userEmail;
        }

        public List<SocialAccountService.SocialAccountRequest> getSocialAccounts() {
            return socialAccounts;
        }

        public void setSocialAccounts(List<SocialAccountService.SocialAccountRequest> socialAccounts) {
            this.socialAccounts = socialAccounts;
        }
    }
}
