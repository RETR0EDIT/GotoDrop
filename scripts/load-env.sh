#!/bin/bash

# Script pour charger les variables d'environnement selon l'environnement

ENV_FILE=".env"
ENVIRONMENT=${1:-development}

case $ENVIRONMENT in
  "production"|"prod")
    ENV_FILE=".env.prod"
    echo "🌍 Chargement de la configuration de production..."
    ;;
  "development"|"dev"|*)
    ENV_FILE=".env"
    echo "🧪 Chargement de la configuration de développement..."
    ;;
esac

if [ -f "$ENV_FILE" ]; then
  echo "📋 Chargement des variables depuis $ENV_FILE"
  export $(cat $ENV_FILE | grep -v '^#' | xargs)
  echo "✅ Variables d'environnement chargées!"
else
  echo "❌ Fichier $ENV_FILE non trouvé!"
  exit 1
fi

# Afficher les variables principales
echo ""
echo "🔧 Configuration actuelle:"
echo "   - Environment: $DEPLOY_ENVIRONMENT"
echo "   - Backend Image: $BACKEND_IMAGE"
echo "   - Frontend Image: $FRONTEND_IMAGE"
echo "   - Backend Port: $BACKEND_PORT"
echo "   - Frontend Port: $FRONTEND_PORT"
echo "   - API URL: $API_URL"
echo ""
