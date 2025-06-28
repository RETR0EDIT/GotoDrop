# GotoDrop - Déploiement Docker

Ce projet utilise Docker et Docker Compose pour orchestrer une application full-stack avec un backend Spring Boot et un frontend React/Vite.

## 🏗️ Architecture

- **Backend**: Spring Boot avec base de données H2 (port 8080)
- **Frontend**: React/Vite servi par Nginx (port 3000)
- **Base de données**: H2 Database (ports 1521 et 8082)

## 🚀 Démarrage rapide

### Prérequis

- Docker Desktop installé
- Docker Compose installé

### Déploiement

#### Sur Windows (PowerShell)

```powershell
.\deploy.ps1
```

#### Sur Linux/Mac (Bash)

```bash
chmod +x deploy.sh
./deploy.sh
```

#### Manuellement

```bash
# Construire et démarrer tous les services
docker-compose up --build -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

## 🌐 Accès aux services

Une fois déployé, vous pouvez accéder aux services suivants :

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Console H2**: http://localhost:8080/h2-console
- **Base de données H2**: http://localhost:8082

### Configuration H2 Console

- **JDBC URL**: `jdbc:h2:file:/app/data/testdb`
- **Username**: `sa`
- **Password**: (vide)

## 📋 Commandes utiles

```bash
# Voir le statut des conteneurs
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f

# Redémarrer un service spécifique
docker-compose restart backend
docker-compose restart frontend

# Reconstruire et redémarrer
docker-compose up --build -d

# Arrêter et supprimer tous les conteneurs
docker-compose down --volumes

# Voir l'utilisation des ressources
docker stats
```

## 🔧 Développement

### Volumes Docker

- `backend-data`: Données persistantes du backend
- `h2-data`: Données de la base de données H2

### Variables d'environnement

Les variables d'environnement sont configurées dans le fichier `docker-compose.yml` :

- `SPRING_PROFILES_ACTIVE=docker`
- `REACT_APP_API_URL=http://localhost:8080/api`

### Modification du code

Pour appliquer les modifications :

1. Modifiez votre code
2. Reconstruisez l'image : `docker-compose build [service]`
3. Redémarrez le service : `docker-compose up -d [service]`

## 🐛 Dépannage

### Problèmes courants

1. **Port déjà utilisé**

   ```bash
   # Vérifier les ports utilisés
   netstat -tulpn | grep :8080

   # Arrêter les services conflictuels
   docker-compose down
   ```

2. **Problème de construction**

   ```bash
   # Nettoyer les images
   docker system prune -a

   # Reconstruire sans cache
   docker-compose build --no-cache
   ```

3. **Problème de connexion réseau**
   ```bash
   # Inspecter le réseau Docker
   docker network ls
   docker network inspect gotodrop_gotodrop-network
   ```

### Logs de débogage

```bash
# Logs détaillés du backend
docker-compose logs backend

# Logs détaillés du frontend
docker-compose logs frontend

# Suivre les logs en temps réel
docker-compose logs -f --tail=100
```

## 📁 Structure des fichiers Docker

```
GotoDrop/
├── docker-compose.yml          # Orchestration des services
├── deploy.sh                   # Script de déploiement (Linux/Mac)
├── deploy.ps1                  # Script de déploiement (Windows)
├── Backend/
│   ├── Dockerfile             # Image Docker du backend
│   ├── .dockerignore          # Fichiers à ignorer
│   └── src/main/resources/
│       └── application-docker.properties
└── Frontend/
    ├── Dockerfile             # Image Docker du frontend
    ├── .dockerignore          # Fichiers à ignorer
    └── nginx.conf             # Configuration Nginx
```
