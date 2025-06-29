package com.example.api.service;

import com.example.api.dto.*;
import com.example.api.entity.Role;
import com.example.api.entity.User;
import com.example.api.exception.AuthenticationException;
import com.example.api.exception.UserAlreadyExistsException;
import com.example.api.exception.UserNotFoundException;
import com.example.api.repository.UserRepository;
import com.example.api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            // Authentification avec Spring Security
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            // Récupérer les détails de l'utilisateur
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            CustomUserDetailsService.CustomUserDetails customUserDetails = (CustomUserDetailsService.CustomUserDetails) userDetails;
            User user = customUserDetails.getUser();

            // Créer des claims supplémentaires pour le JWT
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("userId", user.getId());
            extraClaims.put("roles", user.getRoles());

            // Générer le token JWT
            String token = jwtUtil.generateToken(user.getEmail(), extraClaims);

            // Créer la réponse utilisateur
            UserResponse userResponse = convertToUserResponse(user);

            return new AuthResponse(token, userResponse);

        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Email ou mot de passe incorrect");
        } catch (Exception e) {
            throw new AuthenticationException("Erreur lors de la connexion: " + e.getMessage());
        }
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new UserAlreadyExistsException("Un utilisateur avec cet email existe déjà");
        }

        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new UserAlreadyExistsException("Un utilisateur avec ce nom d'utilisateur existe déjà");
        }

        // Créer un nouvel utilisateur
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setIsActive(true);
        user.setRoles(Set.of(Role.USER)); // Rôle par défaut

        // Sauvegarder l'utilisateur
        user = userRepository.save(user);

        // Créer des claims supplémentaires pour le JWT
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId());
        extraClaims.put("roles", user.getRoles());

        // Générer le token JWT
        String token = jwtUtil.generateToken(user.getEmail(), extraClaims);

        // Créer la réponse utilisateur
        UserResponse userResponse = convertToUserResponse(user);

        return new AuthResponse(token, userResponse);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
        
        return convertToUserResponse(user);
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
