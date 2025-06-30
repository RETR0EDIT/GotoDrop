package com.example.api.service;

import com.example.api.entity.SocialAccount;
import com.example.api.entity.User;
import com.example.api.repository.SocialAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SocialAccountService {
    
    @Autowired
    private SocialAccountRepository socialAccountRepository;
    
    // Créer un nouveau compte social
    public SocialAccount createSocialAccount(User user, String platform, String username) {
        // Vérifier si l'utilisateur a déjà un compte sur cette plateforme
        if (socialAccountRepository.existsByUserAndPlatform(user, platform)) {
            throw new RuntimeException("L'utilisateur a déjà un compte sur " + platform);
        }
        
        SocialAccount socialAccount = new SocialAccount(user, platform, username);
        return socialAccountRepository.save(socialAccount);
    }
    
    // Obtenir tous les comptes sociaux d'un utilisateur
    public List<SocialAccount> getUserSocialAccounts(User user) {
        return socialAccountRepository.findByUserAndIsActiveTrue(user);
    }
    
    // Obtenir un compte social par utilisateur et plateforme
    public Optional<SocialAccount> getSocialAccount(User user, String platform) {
        return socialAccountRepository.findByUserAndPlatform(user, platform);
    }
    
    // Mettre à jour un compte social
    public SocialAccount updateSocialAccount(Long id, SocialAccount accountDetails) {
        SocialAccount account = socialAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte social introuvable"));
                
        account.setUsername(accountDetails.getUsername());
        account.setFollowers(accountDetails.getFollowers());
        account.setProfileUrl(accountDetails.getProfileUrl());
        account.setIsVerified(accountDetails.getIsVerified());
        
        return socialAccountRepository.save(account);
    }
    
    // Désactiver un compte social (soft delete)
    public void deactivateSocialAccount(Long id) {
        SocialAccount account = socialAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte social introuvable"));
                
        account.setIsActive(false);
        socialAccountRepository.save(account);
    }
    
    // Supprimer définitivement un compte social
    public void deleteSocialAccount(Long id) {
        if (!socialAccountRepository.existsById(id)) {
            throw new RuntimeException("Compte social introuvable");
        }
        socialAccountRepository.deleteById(id);
    }
    
    // Lier plusieurs comptes sociaux en une fois
    public List<SocialAccount> linkMultipleSocialAccounts(User user, List<SocialAccountRequest> requests) {
        return requests.stream()
                .map(request -> {
                    try {
                        return createSocialAccount(user, request.getPlatform(), request.getUsername());
                    } catch (RuntimeException e) {
                        // Si le compte existe déjà, on le met à jour
                        Optional<SocialAccount> existing = getSocialAccount(user, request.getPlatform());
                        if (existing.isPresent()) {
                            SocialAccount account = existing.get();
                            account.setUsername(request.getUsername());
                            account.setIsActive(true);
                            return socialAccountRepository.save(account);
                        }
                        throw e;
                    }
                })
                .toList();
    }
    
    // Obtenir les comptes vérifiés d'un utilisateur
    public List<SocialAccount> getVerifiedAccounts(User user) {
        return socialAccountRepository.findVerifiedAccountsByUser(user);
    }
    
    // Compter les comptes sociaux actifs d'un utilisateur
    public long countUserSocialAccounts(User user) {
        return socialAccountRepository.countByUserAndIsActiveTrue(user);
    }
    
    // Classe interne pour les requêtes de création de comptes sociaux
    public static class SocialAccountRequest {
        private String platform;
        private String username;
        private Integer followers;
        
        public SocialAccountRequest() {}
        
        public SocialAccountRequest(String platform, String username) {
            this.platform = platform;
            this.username = username;
        }
        
        // Getters et Setters
        public String getPlatform() { return platform; }
        public void setPlatform(String platform) { this.platform = platform; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public Integer getFollowers() { return followers; }
        public void setFollowers(Integer followers) { this.followers = followers; }
    }
}
