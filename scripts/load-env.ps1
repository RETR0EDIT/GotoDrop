# Script PowerShell pour charger les variables d'environnement

param(
    [string]$Environment = "development"
)

$EnvFile = ".env"

switch ($Environment.ToLower()) {
    { $_ -in "production", "prod" } {
        $EnvFile = ".env.prod"
        Write-Host "🌍 Chargement de la configuration de production..." -ForegroundColor Cyan
    }
    default {
        $EnvFile = ".env"
        Write-Host "🧪 Chargement de la configuration de développement..." -ForegroundColor Cyan
    }
}

if (Test-Path $EnvFile) {
    Write-Host "📋 Chargement des variables depuis $EnvFile" -ForegroundColor Yellow
    
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match "^([^#].*)=(.*)") {
            $name = $matches[1]
            $value = $matches[2]
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    
    Write-Host "✅ Variables d'environnement chargées!" -ForegroundColor Green
} else {
    Write-Host "❌ Fichier $EnvFile non trouvé!" -ForegroundColor Red
    exit 1
}

# Afficher les variables principales
Write-Host ""
Write-Host "🔧 Configuration actuelle:" -ForegroundColor Cyan
Write-Host "   - Environment: $env:DEPLOY_ENVIRONMENT" -ForegroundColor White
Write-Host "   - Backend Image: $env:BACKEND_IMAGE" -ForegroundColor White
Write-Host "   - Frontend Image: $env:FRONTEND_IMAGE" -ForegroundColor White
Write-Host "   - Backend Port: $env:BACKEND_PORT" -ForegroundColor White
Write-Host "   - Frontend Port: $env:FRONTEND_PORT" -ForegroundColor White
Write-Host "   - API URL: $env:API_URL" -ForegroundColor White
Write-Host ""
