package com.example.api.service;

import com.example.api.dto.UserResponse;
import com.example.api.entity.Role;
import com.example.api.entity.User;
import com.example.api.exception.UserNotFoundException;
import com.example.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::convertToUserResponse);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID: " + id));
        return convertToUserResponse(user);
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'email: " + email));
        return convertToUserResponse(user);
    }

    public List<UserResponse> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword).stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getActiveUsers() {
        return userRepository.findByIsActive(true).stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID: " + id));

        // Mettre à jour les champs non-sensibles
        if (updatedUser.getFirstName() != null) {
            existingUser.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            existingUser.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getAvatarUrl() != null) {
            existingUser.setAvatarUrl(updatedUser.getAvatarUrl());
        }

        User savedUser = userRepository.save(existingUser);
        return convertToUserResponse(savedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID: " + id));
        userRepository.delete(user);
    }

    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID: " + id));

        user.setIsActive(!user.getIsActive());
        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }

    public Long countActiveUsers() {
        return userRepository.countActiveUsers();
    }

    // Méthodes manquantes pour l'authentification et la gestion des utilisateurs
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec le nom: " + username));
        return convertToUserResponse(user);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User createAdmin(String username, String email, String password) {
        User admin = new User(username, email, password);
        admin.setRole(Role.ADMIN);
        return userRepository.save(admin);
    }

    // Méthode pour récupérer l'entité User (nécessaire pour l'authentification)
    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'email: " + email));
    }

    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID: " + id));
    }

    // Méthodes pour vérifier l'existence (pour l'inscription)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setPhoneNumber(user.getPhoneNumber());
        userResponse.setAvatarUrl(user.getAvatarUrl());
        userResponse.setIsActive(user.getIsActive());
        userResponse.setRoles(user.getRoles());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());
        return userResponse;
    }
}
