# GotoDrop Backend API

## Description

API REST Spring Boot pour l'application GotoDrop avec authentification JWT, gestion des rôles et sécurité.

## Fonctionnalités

- ✅ Authentification JWT
- ✅ Gestion des utilisateurs
- ✅ Contrôle d'accès basé sur les rôles (RBAC)
- ✅ API REST sécurisée
- ✅ Validation des données
- ✅ Gestion centralisée des erreurs
- ✅ Documentation Swagger (à venir)
- ✅ Base de données H2 pour le développement

## Technologies utilisées

- Spring Boot 3.2.0
- Spring Security 6
- JWT (JSON Web Tokens)
- JPA/Hibernate
- H2 Database (développement)
- Maven
- Java 17

## Configuration

### Prérequis

- Java 17+
- Maven 3.6+

### Variables d'environnement

```properties
JWT_SECRET=myVerySecretKeyForGotoDropApplicationThatShouldBeVeryLongAndSecure
JWT_EXPIRATION=86400000
```

## Démarrage

### 1. Cloner le projet

```bash
git clone <repository-url>
cd GotoDrop/Backend
```

### 2. Installer les dépendances

```bash
mvn clean install
```

### 3. Démarrer l'application

```bash
mvn spring-boot:run
```

L'API sera accessible sur `http://localhost:8080`

## Utilisateurs par défaut

```
Admin: admin@gotodrop.com / Admin123!
User:  test@gotodrop.com / password123
```

## Endpoints API

### Authentification

```
POST /api/auth/login          - Connexion
POST /api/auth/register       - Inscription
GET  /api/auth/me            - Profil utilisateur courant
POST /api/auth/logout        - Déconnexion
```

### Utilisateurs (Authentification requise)

```
GET    /api/users                    - Liste des utilisateurs (ADMIN)
GET    /api/users/paginated         - Liste paginée (ADMIN)
GET    /api/users/{id}              - Utilisateur par ID
GET    /api/users/email/{email}     - Utilisateur par email
GET    /api/users/search            - Recherche d'utilisateurs (ADMIN)
GET    /api/users/active            - Utilisateurs actifs (ADMIN)
PUT    /api/users/{id}              - Modifier un utilisateur
DELETE /api/users/{id}              - Supprimer un utilisateur (ADMIN)
PATCH  /api/users/{id}/toggle-status - Activer/Désactiver (ADMIN)
GET    /api/users/count/active      - Nombre d'utilisateurs actifs (ADMIN)
```

### Public

```
POST /api/public/init-data    - Initialiser les données de test
GET  /api/public/health       - Vérification de santé de l'API
```

### Console H2 (Développement)

```
http://localhost:8080/h2-console
```

## Authentification JWT

### Headers requis

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Exemple de requête

```bash
curl -X GET \
  http://localhost:8080/api/users \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...' \
  -H 'Content-Type: application/json'
```

## Exemples d'utilisation

### Connexion

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gotodrop.com",
    "password": "Admin123!"
  }'
```

### Inscription

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "User"
  }'
```

### Récupérer tous les utilisateurs (Admin requis)

```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Structure du projet

```
src/
├── main/
│   ├── java/com/example/api/
│   │   ├── config/          # Configuration Spring
│   │   ├── controller/      # Contrôleurs REST
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # Entités JPA
│   │   ├── exception/      # Gestion des exceptions
│   │   ├── repository/     # Repositories JPA
│   │   ├── security/       # Configuration sécurité/JWT
│   │   └── service/        # Services métier
│   └── resources/
│       ├── application.properties
│       └── application-docker.properties
```

## Sécurité

### Rôles disponibles

- `USER` : Utilisateur standard
- `ADMIN` : Administrateur avec tous les privilèges

### Permissions

- Les utilisateurs peuvent consulter et modifier leur propre profil
- Les administrateurs ont accès à toutes les fonctionnalités
- Les endpoints publics ne nécessitent pas d'authentification

## Base de données

### H2 (Développement)

- URL: `jdbc:h2:mem:testdb`
- Console: `http://localhost:8080/h2-console`
- Username: `sa`
- Password: (vide)

### MySQL (Production)

Pour utiliser MySQL en production, modifiez le fichier `application-docker.properties`

## Tests

```bash
# Exécuter les tests
mvn test

# Exécuter les tests avec couverture
mvn test jacoco:report
```

## Déploiement

### Docker

```bash
# Construire l'image
docker build -t gotodrop-api .

# Démarrer le conteneur
docker run -p 8080:8080 gotodrop-api
```

### Docker Compose

```bash
docker-compose up
```

## Monitoring

- Actuator endpoints: `http://localhost:8080/actuator`
- Health check: `http://localhost:8080/actuator/health`

## Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
