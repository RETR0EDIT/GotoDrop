#!/bin/bash

# Script de déploiement Docker pour GotoDrop

echo "🚀 Démarrage du déploiement de GotoDrop..."

# Arrêter et supprimer les conteneurs existants
echo "📋 Nettoyage des conteneurs existants..."
docker-compose down --volumes --remove-orphans

# Supprimer les images existantes pour forcer la reconstruction
echo "🗑️ Suppression des images existantes..."
docker rmi gotodrop-backend gotodrop-frontend 2>/dev/null || true

# Construire et démarrer les services
echo "🔨 Construction et démarrage des services..."
docker-compose up --build -d

# Attendre que les services soient prêts
echo "⏳ Attente que les services soient prêts..."
sleep 30

# Vérifier le statut des conteneurs
echo "📊 Statut des conteneurs:"
docker-compose ps

# Afficher les logs
echo "📝 Logs des services:"
docker-compose logs --tail=20

echo "✅ Déploiement terminé!"
echo ""
echo "🌐 Services disponibles:"
echo "   - Frontend:     http://localhost:3000"
echo "   - Backend API:  http://localhost:8080/api"
echo "   - H2 Console:   http://localhost:8080/h2-console"
echo "   - H2 Database:  http://localhost:8082"
echo ""
echo "📋 Commandes utiles:"
echo "   - Voir les logs:        docker-compose logs -f"
echo "   - Arrêter les services: docker-compose down"
echo "   - Redémarrer:           docker-compose restart"
