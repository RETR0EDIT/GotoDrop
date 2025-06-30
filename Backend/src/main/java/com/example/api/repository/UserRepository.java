package com.example.api.repository;

import com.example.api.entity.Role;
import com.example.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Méthodes de requête personnalisées
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    List<User> findByIsActive(Boolean isActive);

    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:keyword% OR u.lastName LIKE %:keyword% OR u.username LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    Long countActiveUsers();

    // Méthodes pour gérer les rôles
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = :role")
    List<User> findByRole(@Param("role") Role role);

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r = :role")
    Long countByRole(@Param("role") Role role);
}
