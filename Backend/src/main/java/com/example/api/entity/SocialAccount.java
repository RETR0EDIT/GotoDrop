package com.example.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "social_accounts")
public class SocialAccount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotBlank(message = "La plateforme est obligatoire")
    @Column(nullable = false)
    private String platform; // TikTok, Instagram, YouTube, etc.
    
    @NotBlank(message = "Le nom d'utilisateur est obligatoire")
    @Column(nullable = false)
    private String username;
    
    @Column
    private Integer followers = 0;
    
    @Column
    private String profileUrl;
    
    @Column
    private Boolean isVerified = false;
    
    @Column
    private Boolean isActive = true;
    
    // Constructeurs
    public SocialAccount() {}
    
    public SocialAccount(User user, String platform, String username) {
        this.user = user;
        this.platform = platform;
        this.username = username;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getPlatform() {
        return platform;
    }
    
    public void setPlatform(String platform) {
        this.platform = platform;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public Integer getFollowers() {
        return followers;
    }
    
    public void setFollowers(Integer followers) {
        this.followers = followers;
    }
    
    public String getProfileUrl() {
        return profileUrl;
    }
    
    public void setProfileUrl(String profileUrl) {
        this.profileUrl = profileUrl;
    }
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    @Override
    public String toString() {
        return "SocialAccount{" +
                "id=" + id +
                ", platform='" + platform + '\'' +
                ", username='" + username + '\'' +
                ", followers=" + followers +
                ", isVerified=" + isVerified +
                ", isActive=" + isActive +
                '}';
    }
}
