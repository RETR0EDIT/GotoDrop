# 🤝 Guide de contribution

Merci de votre intérêt pour contribuer à GotoDrop ! Ce guide vous explique comment participer au développement du projet.

## 📋 Table des matières

- [🚀 Démarrage rapide](#-démarrage-rapide)
- [🏗️ Architecture de développement](#️-architecture-de-développement)
- [🔧 Configuration de l'environnement](#-configuration-de-lenvironnement)
- [📝 Standards de code](#-standards-de-code)
- [🧪 Tests](#-tests)
- [📦 Pull Requests](#-pull-requests)
- [🐛 Signaler des bugs](#-signaler-des-bugs)
- [💡 Proposer des fonctionnalités](#-proposer-des-fonctionnalités)

## 🚀 Démarrage rapide

### 1. Fork et clone

```bash
# Fork le repository sur GitHub
# Puis clone votre fork
git clone https://github.com/VOTRE-USERNAME/gotodrop.git
cd gotodrop

# Ajouter le repository original comme remote
git remote add upstream https://github.com/ORIGINAL-USERNAME/gotodrop.git
```

### 2. Configuration initiale

```bash
# Copier les variables d'environnement
cp .env.example .env

# Modifier .env avec vos valeurs
# Notamment REGISTRY_USERNAME avec votre nom d'utilisateur GitHub
```

### 3. Démarrer l'environnement de développement

```powershell
# Windows
.\deploy.ps1

# Linux/Mac
./deploy.sh
```

### 4. Vérifier que tout fonctionne

- 🌐 Frontend: http://localhost:3000
- 🔧 API: http://localhost:8080/api
- 🗄️ H2 Console: http://localhost:8080/h2-console

## 🏗️ Architecture de développement

### Structure du projet

```
GotoDrop/
├── Backend/                    # API Spring Boot
│   ├── src/main/java/         # Code source Java
│   ├── src/test/java/         # Tests unitaires
│   └── src/main/resources/    # Configuration
├── Frontend/                   # Interface React
│   ├── src/                   # Code source TypeScript/React
│   └── public/                # Fichiers statiques
├── .github/workflows/         # CI/CD GitHub Actions
├── scripts/                   # Scripts utilitaires
└── docker-compose.yml         # Orchestration des services
```

### Technologies utilisées

**Backend:**

- Java 17 + Spring Boot 3.2
- Spring Data JPA + H2 Database
- Maven pour la gestion des dépendances
- JUnit 5 pour les tests

**Frontend:**

- React 18 + TypeScript
- Vite pour le build et le développement
- CSS3 moderne
- Jest pour les tests

**DevOps:**

- Docker + Docker Compose
- GitHub Actions pour CI/CD
- ESLint + Prettier pour la qualité du code

## 🔧 Configuration de l'environnement

### Prérequis

- **Java 17+** (pour développement backend sans Docker)
- **Node.js 18+** (pour développement frontend sans Docker)
- **Docker Desktop** (recommandé)
- **Git**
- **IDE recommandé:** VS Code, IntelliJ IDEA, ou Eclipse

### Variables d'environnement

Copiez `.env.example` vers `.env` et configurez :

```bash
# Votre nom d'utilisateur GitHub
REGISTRY_USERNAME=votre-username

# Repository GitHub
GITHUB_REPOSITORY=votre-username/gotodrop

# Autres variables selon vos besoins...
```

### Développement sans Docker

#### Backend

```bash
cd Backend
./mvnw spring-boot:run
```

#### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## 📝 Standards de code

### Java (Backend)

#### Style de code

- **Indentation:** 4 espaces
- **Longueur de ligne:** 120 caractères max
- **Conventions:** CamelCase pour les classes, camelCase pour les variables

#### Exemple de classe

```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
```

#### Annotations obligatoires

- `@Service` pour les services
- `@Repository` pour les repositories
- `@RestController` pour les contrôleurs REST
- `@Valid` pour la validation des entrées

### TypeScript/React (Frontend)

#### Style de code

- **Indentation:** 2 espaces
- **Longueur de ligne:** 100 caractères max
- **Conventions:** PascalCase pour les composants, camelCase pour les variables

#### Exemple de composant

```tsx
interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onUserSelect }) => {
  return (
    <div className="user-list">
      {users.map((user) => (
        <div
          key={user.id}
          className="user-item"
          onClick={() => onUserSelect(user)}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};
```

### Configuration ESLint/Prettier

Le projet utilise ESLint et Prettier pour maintenir la qualité du code :

```bash
# Frontend - Vérifier le style
cd Frontend
npm run lint

# Corriger automatiquement
npm run lint:fix

# Formater avec Prettier
npm run format
```

### Commits

Utilisez des messages de commit descriptifs selon la convention :

```
type(scope): description

Types possibles:
- feat: nouvelle fonctionnalité
- fix: correction de bug
- docs: documentation
- style: formatage, point-virgules manquants, etc.
- refactor: refactoring du code
- test: ajout de tests
- chore: tâches de maintenance
```

Exemples :

```bash
git commit -m "feat(api): add user search endpoint"
git commit -m "fix(frontend): resolve login form validation"
git commit -m "docs: update deployment guide"
```

## 🧪 Tests

### Backend (Java)

#### Tests unitaires

```java
@SpringBootTest
class UserServiceTest {

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Test
    void shouldCreateUser() {
        // Given
        User user = new User("testuser", "test@example.com", "password");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        User result = userService.createUser(user);

        // Then
        assertThat(result.getUsername()).isEqualTo("testuser");
    }
}
```

#### Tests d'intégration

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldCreateUserViaApi() {
        // Given
        User user = new User("testuser", "test@example.com", "password");

        // When
        ResponseEntity<User> response = restTemplate.postForEntity("/api/users", user, User.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}
```

#### Exécuter les tests

```bash
cd Backend
./mvnw test                    # Tous les tests
./mvnw test -Dtest=UserServiceTest  # Test spécifique
./mvnw test -Dtest="*Integration*"  # Tests d'intégration
```

### Frontend (React)

#### Tests de composants

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { UserList } from "./UserList";

describe("UserList", () => {
  const mockUsers = [
    { id: 1, username: "user1", email: "user1@example.com" },
    { id: 2, username: "user2", email: "user2@example.com" },
  ];

  it("should render all users", () => {
    render(<UserList users={mockUsers} onUserSelect={jest.fn()} />);

    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("user2")).toBeInTheDocument();
  });

  it("should call onUserSelect when user clicked", () => {
    const mockOnUserSelect = jest.fn();
    render(<UserList users={mockUsers} onUserSelect={mockOnUserSelect} />);

    fireEvent.click(screen.getByText("user1"));

    expect(mockOnUserSelect).toHaveBeenCalledWith(mockUsers[0]);
  });
});
```

#### Exécuter les tests

```bash
cd Frontend
npm test                    # Mode interactif
npm run test:coverage      # Avec couverture
npm run test:ci            # Pour CI (non-interactif)
```

### Tests end-to-end (optionnel)

Pour des tests complets, vous pouvez utiliser Cypress :

```bash
# Installation
cd Frontend
npm install --save-dev cypress

# Configuration cypress.config.ts
export default {
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
  },
}

# Test exemple
// cypress/e2e/user-management.cy.ts
describe('User Management', () => {
  it('should create a new user', () => {
    cy.visit('/');
    cy.get('[data-testid=create-user-btn]').click();
    cy.get('[data-testid=username-input]').type('newuser');
    cy.get('[data-testid=email-input]').type('newuser@example.com');
    cy.get('[data-testid=submit-btn]').click();
    cy.contains('User created successfully').should('be.visible');
  });
});
```

## 📦 Pull Requests

### Avant de soumettre

1. **Synchroniser avec upstream**

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

2. **Créer une branche feature**

```bash
git checkout -b feature/description-courte
```

3. **Développer et tester**

```bash
# Développer votre fonctionnalité
# Exécuter les tests
cd Backend && ./mvnw test
cd Frontend && npm test
```

4. **Commit et push**

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push origin feature/description-courte
```

### Template de Pull Request

```markdown
## 📝 Description

Brève description des changements.

## 🔄 Type de changement

- [ ] Bug fix (changement qui corrige un problème)
- [ ] Nouvelle fonctionnalité (changement qui ajoute une fonctionnalité)
- [ ] Breaking change (changement qui casse la compatibilité)
- [ ] Documentation

## 🧪 Tests

- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration ajoutés/mis à jour
- [ ] Tests manuels effectués

## 📋 Checklist

- [ ] Le code suit les standards du projet
- [ ] Les tests passent localement
- [ ] La documentation est mise à jour si nécessaire
- [ ] Les commentaires ont été supprimés
- [ ] Aucun secret n'est exposé

## 📷 Screenshots (si applicable)

Ajoutez des captures d'écran pour les changements UI.
```

### Processus de review

1. **Checks automatiques** : Les GitHub Actions doivent passer
2. **Review de code** : Au moins un maintainer doit approuver
3. **Tests** : Tous les tests doivent passer
4. **Merge** : Squash and merge pour un historique propre

## 🐛 Signaler des bugs

### Template d'issue de bug

```markdown
## 🐛 Description du bug

Description claire et concise du problème.

## 🔄 Étapes pour reproduire

1. Aller à '...'
2. Cliquer sur '...'
3. Faire défiler jusqu'à '...'
4. Voir l'erreur

## ✅ Comportement attendu

Description de ce qui devrait se passer.

## 📷 Screenshots

Si applicable, ajoutez des captures d'écran.

## 🖥️ Environnement

- OS: [e.g. Windows 10, Ubuntu 20.04]
- Navigateur: [e.g. Chrome 91, Firefox 89]
- Version du projet: [e.g. v1.2.0]

## 📋 Contexte supplémentaire

Tout autre contexte utile pour comprendre le problème.
```

### Priorités des bugs

- **🔴 Critique** : Bloque l'utilisation de l'application
- **🟠 Élevée** : Fonctionnalité importante cassée
- **🟡 Moyenne** : Problème mineur mais gênant
- **🟢 Faible** : Amélioration cosmétique

## 💡 Proposer des fonctionnalités

### Template d'issue de fonctionnalité

```markdown
## 🚀 Fonctionnalité proposée

Description claire et concise de la fonctionnalité souhaitée.

## 🎯 Problème résolu

Quel problème cette fonctionnalité résout-elle ?

## 💡 Solution proposée

Description de la solution que vous aimeriez voir.

## 🔄 Alternatives considérées

Avez-vous pensé à d'autres solutions ?

## 📋 Contexte supplémentaire

Mockups, exemples d'autres applications, etc.
```

### Processus d'approbation

1. **Discussion** : La fonctionnalité est discutée avec l'équipe
2. **Approbation** : Les maintainers approuvent la fonctionnalité
3. **Implémentation** : Développement de la fonctionnalité
4. **Tests** : Tests approfondis
5. **Documentation** : Mise à jour de la documentation

## 🏷️ Labels utilisés

### Type

- `bug` : Correction de bug
- `enhancement` : Nouvelle fonctionnalité
- `documentation` : Amélioration de la documentation
- `refactor` : Refactoring du code

### Priorité

- `priority: high` : Priorité élevée
- `priority: medium` : Priorité moyenne
- `priority: low` : Priorité faible

### Status

- `status: in-progress` : En cours de développement
- `status: review` : En attente de review
- `status: blocked` : Bloqué par une dépendance

### Composant

- `backend` : Concerne l'API Spring Boot
- `frontend` : Concerne l'interface React
- `devops` : Concerne le déploiement/CI-CD

## 📞 Contact

- 💬 **Discussions** : Utilisez les GitHub Discussions
- 📧 **Email** : dev@gotodrop.com
- 🐛 **Bugs** : Créez une issue GitHub

---

Merci de contribuer à GotoDrop ! 🎉
