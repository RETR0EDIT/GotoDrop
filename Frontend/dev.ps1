# Script de développement Frontend avec pnpm (PowerShell)

Write-Host "🚀 Démarrage de l'environnement de développement Frontend..." -ForegroundColor Green

# Vérifier que pnpm est installé
try {
    $pnpmVersion = pnpm --version
    Write-Host "📦 Version de pnpm: $pnpmVersion" -ForegroundColor Cyan
} catch {
    Write-Host "❌ pnpm n'est pas installé!" -ForegroundColor Red
    Write-Host "📦 Installation de pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Installer les dépendances
Write-Host "📥 Installation des dépendances..." -ForegroundColor Yellow
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances!" -ForegroundColor Red
    exit 1
}

# Vérifier le code
Write-Host "🔍 Vérification du code..." -ForegroundColor Yellow
pnpm run lint

# Exécuter les tests
Write-Host "🧪 Exécution des tests..." -ForegroundColor Yellow
pnpm run test:ci

# Démarrer le serveur de développement
Write-Host "🌐 Démarrage du serveur de développement..." -ForegroundColor Green
Write-Host "👉 L'application sera disponible sur http://localhost:3000" -ForegroundColor Cyan
pnpm run dev
