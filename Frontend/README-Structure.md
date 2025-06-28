# Frontend GotoDrop - Structure Optimisée

## 📁 Architecture

Cette structure frontend React/Vite est optimisée pour les performances avec lazy loading et chargement CSS modulaire.

```
src/
├── components/
│   ├── admin/           # Composants admin
│   │   ├── AdminDashboard.tsx
│   │   └── AdminUserList.tsx
│   ├── shared/          # Composants partagés
│   │   ├── ErrorBoundary.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Navigation.tsx
│   └── users/           # Composants utilisateurs
│       ├── UserLogin.tsx
│       └── UserProfile.tsx
├── hooks/               # Hooks personnalisés
│   ├── index.ts
│   ├── useAuth.ts
│   └── useUsers.ts
├── pages/               # Pages avec lazy loading
│   ├── HomePage.tsx
│   ├── admin/
│   │   └── AdminPage.tsx
│   └── users/
│       └── UserPage.tsx
├── router/              # Configuration du routage
│   └── AppRouter.tsx
├── styles/              # Styles modulaires
│   ├── components/      # CSS par composant
│   │   ├── layout.css
│   │   ├── loading.css
│   │   └── navigation.css
│   ├── pages/           # CSS par page
│   │   ├── admin.css
│   │   ├── home.css
│   │   └── user.css
│   ├── components.css   # Styles globaux composants
│   ├── globals.css      # Variables et reset CSS
│   └── index.css        # Point d'entrée styles
└── test/                # Tests
    ├── App.test.tsx
    └── setup.ts
```

## 🚀 Optimisations

### Lazy Loading

- **Pages** : Chargement à la demande via `React.lazy()`
- **Composants** : Import dynamique pour réduire le bundle initial
- **CSS** : Chargement modulaire par page/composant

### Performance CSS

- **Variables CSS** : Thème cohérent et maintenable
- **Code splitting** : CSS séparé par page (Vite automatique)
- **Import sélectif** : Évite le chargement du CSS non utilisé

### Bundles générés (optimisés)

```
Layout-CMf1kuD2.css     0.86 kB  # Layout component
UserPage-CEEGnY84.css   2.07 kB  # User page styles
HomePage-D7gOdpt-.css   2.60 kB  # Home page styles
AdminPage-sNjTtwn8.css  3.80 kB  # Admin page styles
index-Bf7HQvwi.css      9.09 kB  # Global styles
```

## 🎯 Hooks Personnalisés

### `useAuth`

- Gestion de l'authentification
- Login/logout avec validation
- Persistance du token
- Gestion des erreurs

### `useUsers`

- CRUD utilisateurs (simulation)
- Recherche et filtrage
- Gestion du statut
- États de chargement

## 🔧 Usage

### Démarrage

```bash
npm run dev     # Mode développement
npm run build   # Build production
npm run preview # Prévisualisation build
```

### Navigation

- `/` - Page d'accueil
- `/users` - Espace utilisateur (profile/login)
- `/admin` - Administration (dashboard/users)

### Ajout d'une nouvelle page

1. Créer le composant dans `src/pages/`
2. Créer le CSS dans `src/styles/pages/`
3. Importer le CSS dans le composant
4. Ajouter la route dans `AppRouter.tsx`

### Ajout d'un composant

1. Créer le composant dans le dossier approprié
2. Créer le CSS dans `src/styles/components/`
3. Importer le CSS dans le composant

## 🎨 Système de Design

### Variables CSS

```css
--primary-color: #2563eb --success-color: #16a34a --error-color: #dc2626 --warning-color: #d97706
  --text-primary: #1f2937 --bg-primary: #ffffff;
```

### Composants réutilisables

- Boutons (`btn`, `btn-primary`, `btn-secondary`)
- Cartes (`card`, `card-header`, `card-content`)
- Formulaires (`form-group`, `form-input`)
- Tables (`table`, `table-responsive`)
- Alertes (`alert`, `alert-success`, `alert-error`)

## 🧪 Tests

Les tests sont configurés avec Vitest et Testing Library :

```bash
npm test       # Lancer les tests
npm run test:ui # Interface graphique
```

## 📱 Responsive

Toutes les pages et composants sont responsive avec :

- Mobile first design
- Breakpoints : 768px, 1024px, 1200px
- Grid CSS et Flexbox
- Navigation mobile adaptée

## 🔐 Accessibilité

- Labels associés aux inputs
- Rôles ARIA appropriés
- Navigation au clavier
- Contraste suffisant
- Focus visible
