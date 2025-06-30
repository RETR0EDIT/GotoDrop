package com.example.api.service;

import com.example.api.entity.Role;
import com.example.api.entity.User;
import com.example.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializerService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Créer l'admin par défaut s'il n'existe pas
        if (!userRepository.existsByEmail("admin@gotodrop.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@gotodrop.com");
            admin.setPassword("admin123"); // En production, utilisez un mot de passe hashé
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Compte administrateur créé : admin@gotodrop.com / admin123");
        }

        // Créer un utilisateur de test s'il n'existe pas
        if (!userRepository.existsByEmail("user@gotodrop.com")) {
            User user = new User();
            user.setUsername("testuser");
            user.setEmail("user@gotodrop.com");
            user.setPassword("user123"); // En production, utilisez un mot de passe hashé
            user.setRole(Role.USER);
            userRepository.save(user);
            System.out.println("Compte utilisateur de test créé : user@gotodrop.com / user123");
        }
    }
}
