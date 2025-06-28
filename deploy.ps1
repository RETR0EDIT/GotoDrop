# Script de déploiement Docker pour GotoDrop (Windows PowerShell)

param(
    [string]$Environment = "development"
)

Write-Host "🚀 Démarrage du déploiement de GotoDrop..." -ForegroundColor Green

# Charger les variables d'environnement
Write-Host "📋 Chargement des variables d'environnement..." -ForegroundColor Yellow
& .\scripts\load-env.ps1 -Environment $Environment

# Vérifier que Docker est installé et en cours d'exécution
Write-Host "🔍 Vérification de Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker détecté: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas installé ou n'est pas en cours d'exécution!" -ForegroundColor Red
    Write-Host "Veuillez installer Docker Desktop et le démarrer avant de continuer." -ForegroundColor Red
    exit 1
}

# Vérifier que Docker Compose est disponible
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose détecté: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose n'est pas disponible!" -ForegroundColor Red
    exit 1
}

# Arrêter et supprimer les conteneurs existants
Write-Host "📋 Nettoyage des conteneurs existants..." -ForegroundColor Yellow
docker-compose down --volumes --remove-orphans

# Supprimer les images existantes pour forcer la reconstruction
Write-Host "🗑️ Suppression des images existantes..." -ForegroundColor Yellow
docker rmi gotodrop_back gotodrop_front 2>$null

# Construire et démarrer les services
Write-Host "🔨 Construction et démarrage des services..." -ForegroundColor Yellow
Write-Host "⚠️  Cette étape peut prendre plusieurs minutes lors du premier déploiement..." -ForegroundColor Cyan

$buildResult = docker-compose up --build -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la construction des services!" -ForegroundColor Red
    Write-Host "Affichage des logs d'erreur:" -ForegroundColor Yellow
    docker-compose logs
    exit 1
}

Write-Host "✅ Services construits et démarrés avec succès!" -ForegroundColor Green

# Attendre que les services soient prêts
Write-Host "⏳ Attente que les services soient prêts..." -ForegroundColor Yellow
Write-Host "Vérification de la santé des services..." -ForegroundColor Cyan

for ($i = 1; $i -le 6; $i++) {
    Start-Sleep -Seconds 10
    Write-Host "⏱️  Tentative $i/6..." -ForegroundColor Gray
    
    # Vérifier si le backend répond
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend est prêt!" -ForegroundColor Green
            break
        }
    } catch {
        # Continuer à attendre
    }
    
    if ($i -eq 6) {
        Write-Host "⚠️  Le backend met plus de temps que prévu à démarrer. Vérifiez les logs." -ForegroundColor Yellow
    }
}

# Vérifier le statut des conteneurs
Write-Host "📊 Statut des conteneurs:" -ForegroundColor Cyan
docker-compose ps

# Afficher les logs
Write-Host "📝 Logs des services:" -ForegroundColor Cyan
docker-compose logs --tail=20

Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Services disponibles:" -ForegroundColor Cyan
Write-Host "   - Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host "   - Backend API:  http://localhost:8080/api" -ForegroundColor White
Write-Host "   - H2 Console:   http://localhost:8080/h2-console" -ForegroundColor White
Write-Host "   - H2 Database:  http://localhost:8082" -ForegroundColor White
Write-Host "   - Health Check: http://localhost:8080/actuator/health" -ForegroundColor White
Write-Host ""
Write-Host "📋 Commandes utiles:" -ForegroundColor Cyan
Write-Host "   - Voir les logs:        docker-compose logs -f" -ForegroundColor White
Write-Host "   - Arrêter les services: docker-compose down" -ForegroundColor White
Write-Host "   - Redémarrer:           docker-compose restart" -ForegroundColor White
Write-Host "   - Status des conteneurs: docker-compose ps" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Configuration H2 Console:" -ForegroundColor Cyan
Write-Host "   - JDBC URL: jdbc:h2:file:/app/data/testdb" -ForegroundColor White
Write-Host "   - Username: sa" -ForegroundColor White
Write-Host "   - Password: (vide)" -ForegroundColor White
Write-Host ""
Write-Host "📦 Frontend utilise pnpm pour la gestion des dépendances" -ForegroundColor Cyan
Write-Host "   - Développement local: cd Frontend && pnpm run dev" -ForegroundColor White
