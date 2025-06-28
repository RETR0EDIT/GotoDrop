#!/bin/bash

# Script de développement Frontend avec pnpm

echo "🚀 Démarrage de l'environnement de développement Frontend..."

# Vérifier que pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm n'est pas installé!"
    echo "📦 Installation de pnpm..."
    npm install -g pnpm
fi

echo "📦 Version de pnpm: $(pnpm --version)"

# Installer les dépendances
echo "📥 Installation des dépendances..."
pnpm install

# Vérifier le code
echo "🔍 Vérification du code..."
pnpm run lint

# Exécuter les tests
echo "🧪 Exécution des tests..."
pnpm run test:ci

# Démarrer le serveur de développement
echo "🌐 Démarrage du serveur de développement..."
echo "👉 L'application sera disponible sur http://localhost:3000"
pnpm run dev
