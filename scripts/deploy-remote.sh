#!/bin/bash

# Script de déploiement sur serveur distant
# Utilisé par GitHub Actions

set -e

echo "🚀 Démarrage du déploiement sur serveur distant..."

# Variables
DEPLOY_PATH="/opt/gotodrop"
BACKUP_PATH="/opt/gotodrop/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Créer le répertoire de sauvegarde
mkdir -p "$BACKUP_PATH"

# Sauvegarder la configuration actuelle
if [ -f "$DEPLOY_PATH/docker-compose.yml" ]; then
    echo "📋 Sauvegarde de la configuration actuelle..."
    cp "$DEPLOY_PATH/docker-compose.yml" "$BACKUP_PATH/docker-compose_$TIMESTAMP.yml"
fi

# Sauvegarder les données
if [ -d "$DEPLOY_PATH/data" ]; then
    echo "💾 Sauvegarde des données..."
    tar -czf "$BACKUP_PATH/data_$TIMESTAMP.tar.gz" -C "$DEPLOY_PATH" data/
fi

# Arrêter les services actuels
echo "⏹️ Arrêt des services actuels..."
cd "$DEPLOY_PATH"
docker-compose down --remove-orphans

# Supprimer les anciennes images
echo "🗑️ Nettoyage des anciennes images..."
docker system prune -f

# Télécharger les nouvelles images
echo "📥 Téléchargement des nouvelles images..."
docker-compose pull

# Démarrer les nouveaux services
echo "🚀 Démarrage des nouveaux services..."
docker-compose up -d

# Attendre que les services soient prêts
echo "⏳ Vérification de la santé des services..."
sleep 30

# Vérifier que l'API répond
for i in {1..10}; do
    if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo "✅ API est opérationnelle!"
        break
    else
        echo "⏳ Tentative $i/10 - API pas encore prête..."
        sleep 10
    fi
    
    if [ $i -eq 10 ]; then
        echo "❌ L'API ne répond pas après 10 tentatives!"
        echo "🔄 Rollback vers la version précédente..."
        
        # Rollback
        docker-compose down
        if [ -f "$BACKUP_PATH/docker-compose_$TIMESTAMP.yml" ]; then
            cp "$BACKUP_PATH/docker-compose_$TIMESTAMP.yml" "$DEPLOY_PATH/docker-compose.yml"
            docker-compose up -d
        fi
        exit 1
    fi
done

# Nettoyer les anciennes sauvegardes (garder seulement les 5 dernières)
echo "🧹 Nettoyage des anciennes sauvegardes..."
cd "$BACKUP_PATH"
ls -t *.yml 2>/dev/null | tail -n +6 | xargs -r rm
ls -t *.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm

echo "✅ Déploiement terminé avec succès!"
echo "🌐 Application disponible sur: http://$(hostname -I | awk '{print $1}'):3000"
