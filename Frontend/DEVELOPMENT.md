# Guide de Développement - Frontend GotoDrop

## 🏁 Démarrage Rapide

### Prérequis

- Node.js 20+
- pnpm ou npm
- Docker (pour l'environnement complet)

### Installation

```bash
# Cloner le projet
cd Frontend/

# Installer les dépendances
pnpm install

# Développement
pnpm dev

# Build production
pnpm build
```

### Environnement Docker

```bash
# Depuis la racine du projet
docker-compose up -d

# Frontend accessible sur http://localhost:3000
# Backend accessible sur http://localhost:8080
```

## 🛠️ Structure de Développement

### Ajout d'une nouvelle fonctionnalité

1. **Créer un hook personnalisé** (si nécessaire)

```typescript
// src/hooks/useMyFeature.ts
export const useMyFeature = () => {
  // Logique métier
  return { data, loading, error };
};
```

2. **Créer le composant**

```typescript
// src/components/category/MyComponent.tsx
import React from 'react';
import './MyComponent.css'; // CSS modulaire

const MyComponent: React.FC = () => {
  return <div>Mon composant</div>;
};

export default MyComponent;
```

3. **Créer les styles**

```css
/* src/styles/components/mycomponent.css */
.my-component {
  /* Styles spécifiques */
}
```

4. **Ajouter au routeur** (si page)

```typescript
// src/router/AppRouter.tsx
const MyPage = React.lazy(() => import('../pages/MyPage'));
```

### Conventions de Nommage

- **Composants** : PascalCase (`UserProfile.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useAuth.ts`)
- **CSS** : kebab-case (`user-profile.css`)
- **Types** : PascalCase avec suffixe approprié (`User`, `AuthUser`)

### Gestion des États

#### Hook personnalisé

```typescript
export const useFeature = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actions
  const fetchData = async () => {
    setLoading(true);
    try {
      // API call
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};
```

#### Dans le composant

```typescript
const MyComponent = () => {
  const { data, loading, error } = useFeature();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return <div>{/* Contenu */}</div>;
};
```

## 🎨 Guidelines CSS

### Structure des styles

```css
/* 1. Variables et utilitaires */
:root {
  --custom-var: value;
}

/* 2. Base du composant */
.component {
  /* Layout */
  /* Appearance */
  /* Transitions */
}

/* 3. Variants */
.component--variant {
  /* Modifications */
}

/* 4. États */
.component:hover,
.component.active {
  /* États interactifs */
}

/* 5. Responsive */
@media (max-width: 768px) {
  .component {
    /* Mobile styles */
  }
}
```

### Classes utilitaires disponibles

```css
/* Layout */
.container, .flex, .grid
.justify-center, .items-center
.gap-1, .gap-2, .gap-4

/* Spacing */
.p-1, .p-2, .p-4 (padding)
.m-1, .m-2, .m-4 (margin)

/* Typography */
.text-sm, .text-lg, .text-xl
.font-normal, .font-medium, .font-bold

/* Colors */
.text-primary, .text-secondary
.bg-primary, .bg-secondary
```

## 🧪 Tests

### Test de composant

```typescript
// src/components/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

### Test de hook

```typescript
// src/hooks/__tests__/useMyHook.test.ts
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('returns expected values', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.data).toBe(null);
  });
});
```

## 🔧 Configuration

### TypeScript

Configuration dans `tsconfig.json` avec :

- Strict mode activé
- Path mapping pour les imports
- ESModules support

### Vite

Configuration dans `vite.config.ts` :

- Hot reload optimisé
- Code splitting automatique
- CSS preprocessing

### ESLint

Rules configurées pour :

- React best practices
- TypeScript strict
- Accessibility (a11y)

## 📦 Bundle Optimization

### Lazy Loading

```typescript
// Composant lazy
const LazyComponent = React.lazy(() => import('./Component'));

// Usage avec Suspense
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

### CSS Code Splitting

Vite sépare automatiquement le CSS par route :

- CSS global : chargé une fois
- CSS de page : chargé à la demande
- CSS de composant : inclus dans le bundle du composant

### Bundle Analysis

```bash
# Analyser la taille des bundles
pnpm build
pnpm preview

# Vérifier les performances
npx lighthouse http://localhost:4173
```

## 🚀 Déploiement

### Build Production

```bash
pnpm build
# Génère le dossier dist/
```

### Variables d'environnement

```env
# .env.production
VITE_API_URL=https://api.gotodrop.com
VITE_APP_VERSION=1.0.0
```

### Docker

```dockerfile
# Multi-stage build optimisé
FROM node:20-alpine as builder
# Build steps...

FROM nginx:alpine
# Serve static files
```

## 🐛 Debugging

### React DevTools

- Installer l'extension navigateur
- Profiler les performances
- Inspecter les props/state

### Vite DevTools

```bash
# Mode debug
DEBUG=vite:* pnpm dev

# Logs détaillés
pnpm dev --debug
```

### Logs Console

```typescript
// Développement uniquement
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## 📚 Ressources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CSS Guidelines](https://cssguidelin.es/)
- [A11y Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
