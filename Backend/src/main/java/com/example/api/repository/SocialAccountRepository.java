package com.example.api.repository;

import com.example.api.entity.SocialAccount;
import com.example.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    
    // Trouver tous les comptes sociaux d'un utilisateur
    List<SocialAccount> findByUser(User user);
    
    // Trouver tous les comptes sociaux actifs d'un utilisateur
    List<SocialAccount> findByUserAndIsActiveTrue(User user);
    
    // Trouver un compte social par utilisateur et plateforme
    Optional<SocialAccount> findByUserAndPlatform(User user, String platform);
    
    // Vérifier si un utilisateur a déjà un compte sur une plateforme
    boolean existsByUserAndPlatform(User user, String platform);
    
    // Trouver tous les comptes d'une plateforme spécifique
    List<SocialAccount> findByPlatform(String platform);
    
    // Trouver les comptes vérifiés d'un utilisateur
    @Query("SELECT sa FROM SocialAccount sa WHERE sa.user = :user AND sa.isVerified = true AND sa.isActive = true")
    List<SocialAccount> findVerifiedAccountsByUser(@Param("user") User user);
    
    // Compter les comptes sociaux actifs d'un utilisateur
    long countByUserAndIsActiveTrue(User user);
}
