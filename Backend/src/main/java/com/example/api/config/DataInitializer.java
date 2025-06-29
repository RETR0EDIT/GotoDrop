package com.example.api.config;

import com.example.api.entity.Role;
import com.example.api.entity.User;
import com.example.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Créer un utilisateur admin par défaut si il n'existe pas
        if (!userRepository.existsByEmail("admin@gotodrop.com")) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@gotodrop.com");
            adminUser.setPassword(passwordEncoder.encode("Admin123!"));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("GotoDrop");
            adminUser.setIsActive(true);
            adminUser.setRoles(Set.of(Role.ADMIN, Role.USER));
            
            userRepository.save(adminUser);
            System.out.println("Utilisateur admin créé: admin@gotodrop.com / Admin123!");
        }

        // Créer un utilisateur test si il n'existe pas
        if (!userRepository.existsByEmail("test@gotodrop.com")) {
            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setEmail("test@gotodrop.com");
            testUser.setPassword(passwordEncoder.encode("password123"));
            testUser.setFirstName("Test");
            testUser.setLastName("User");
            testUser.setIsActive(true);
            testUser.setRoles(Set.of(Role.USER));
            
            userRepository.save(testUser);
            System.out.println("Utilisateur test créé: test@gotodrop.com / password123");
        }
    }
}
