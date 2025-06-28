# 🚀 Guide de déploiement GotoDrop

Ce guide détaille les différentes méthodes de déploiement de l'application GotoDrop.

## 📋 Options de déploiement

1. [🖥️ Déploiement local](#️-déploiement-local)
2. [🌐 Serveur VPS/Cloud](#-serveur-vpscloud)
3. [☁️ Services cloud managés](#️-services-cloud-managés)
4. [🔄 GitHub Actions (automatique)](#-github-actions-automatique)

---

## 🖥️ Déploiement local

### Pour le développement

```powershell
# Windows
.\deploy.ps1

# Linux/Mac
./deploy.sh
```

### Pour tester la production localement

```powershell
# Windows
.\deploy.ps1 -Environment production

# Linux/Mac
./deploy.sh production
```

---

## 🌐 Serveur VPS/Cloud

### 1. Préparer le serveur

#### Ubuntu/Debian

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Installer Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Redémarrer pour appliquer les groupes
sudo reboot
```

#### CentOS/RHEL

```bash
# Installer Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Installer Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configurer l'accès SSH

```bash
# Sur votre machine locale, générer une clé SSH
ssh-keygen -t ed25519 -C "gotodrop-deploy" -f ~/.ssh/gotodrop_deploy

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/gotodrop_deploy.pub user@your-server.com

# Tester la connexion
ssh -i ~/.ssh/gotodrop_deploy user@your-server.com
```

### 3. Préparer l'environnement de déploiement

```bash
# Sur le serveur
sudo mkdir -p /opt/gotodrop
sudo chown $USER:$USER /opt/gotodrop
cd /opt/gotodrop

# Créer la structure
mkdir -p {logs,data,backups,ssl}
```

### 4. Configurer les fichiers

#### docker-compose.prod.yml

```bash
# Copier le fichier de production
scp docker-compose.prod.yml user@your-server:/opt/gotodrop/docker-compose.yml
```

#### .env de production

```bash
# Créer le fichier .env sur le serveur
cat > /opt/gotodrop/.env << EOF
# Configuration production
BACKEND_IMAGE=ghcr.io/your-username/gotodrop/back:latest
FRONTEND_IMAGE=ghcr.io/your-username/gotodrop/front:latest

BACKEND_CONTAINER_NAME=gotodrop-back-prod
FRONTEND_CONTAINER_NAME=gotodrop-front-prod

BACKEND_PORT=8080
FRONTEND_PORT=80

API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

DB_NAME=gotodrop_prod
DB_USERNAME=sa
DB_PASSWORD=YourSecurePassword123!

SPRING_PROFILES_ACTIVE=docker,prod
LOG_LEVEL=WARN

CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

DEPLOY_ENVIRONMENT=production
EOF
```

### 5. Configurer le reverse proxy (Nginx)

```bash
# Installer Nginx
sudo apt install nginx -y

# Créer la configuration
sudo tee /etc/nginx/sites-available/gotodrop << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirection HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # Certificats SSL (à configurer avec Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Health check
    location /actuator/health {
        proxy_pass http://localhost:8080;
        access_log off;
    }
}
EOF

# Activer le site
sudo ln -s /etc/nginx/sites-available/gotodrop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Configurer SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir un certificat
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run

# Programmer le renouvellement
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 7. Déployer l'application

```bash
# Sur le serveur
cd /opt/gotodrop

# Se connecter au registry GitHub
echo $GITHUB_TOKEN | docker login ghcr.io -u your-username --password-stdin

# Démarrer l'application
docker-compose up -d

# Vérifier le statut
docker-compose ps
docker-compose logs -f
```

### 8. Configurer les sauvegardes

```bash
# Script de sauvegarde
sudo tee /opt/gotodrop/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/gotodrop/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Sauvegarder les données
docker-compose exec -T backend tar -czf - /app/data > "$BACKUP_DIR/data_$TIMESTAMP.tar.gz"

# Sauvegarder la configuration
cp .env "$BACKUP_DIR/env_$TIMESTAMP"
cp docker-compose.yml "$BACKUP_DIR/compose_$TIMESTAMP.yml"

# Nettoyer les anciennes sauvegardes (garder 7 jours)
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "env_*" -mtime +7 -delete
find "$BACKUP_DIR" -name "compose_*.yml" -mtime +7 -delete

echo "Sauvegarde terminée: $TIMESTAMP"
EOF

chmod +x /opt/gotodrop/backup.sh

# Programmer les sauvegardes quotidiennes
echo "0 2 * * * /opt/gotodrop/backup.sh" | crontab -
```

---

## ☁️ Services cloud managés

### AWS (Amazon Web Services)

#### Option 1: ECS (Elastic Container Service)

```bash
# 1. Pousser les images vers ECR
aws ecr create-repository --repository-name gotodrop/back
aws ecr create-repository --repository-name gotodrop/front

# 2. Créer les task definitions
cat > task-definition-backend.json << EOF
{
  "family": "gotodrop-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "ghcr.io/your-username/gotodrop/back:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "SPRING_PROFILES_ACTIVE", "value": "docker,prod"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/gotodrop-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

# 3. Créer le service
aws ecs create-service \
  --cluster gotodrop-cluster \
  --service-name gotodrop-backend \
  --task-definition gotodrop-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

#### Option 2: App Runner

```bash
# Créer un service App Runner
aws apprunner create-service \
  --service-name gotodrop-backend \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "ghcr.io/your-username/gotodrop/back:latest",
      "ImageConfiguration": {
        "Port": "8080",
        "RuntimeEnvironmentVariables": {
          "SPRING_PROFILES_ACTIVE": "docker,prod"
        }
      },
      "ImageRepositoryType": "ECR_PUBLIC"
    },
    "AutoDeploymentsEnabled": true
  }' \
  --instance-configuration '{
    "Cpu": "0.25 vCPU",
    "Memory": "0.5 GB"
  }'
```

### Google Cloud Platform

#### Cloud Run

```bash
# Déployer le backend
gcloud run deploy gotodrop-backend \
  --image ghcr.io/your-username/gotodrop/back:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars SPRING_PROFILES_ACTIVE=docker,prod

# Déployer le frontend
gcloud run deploy gotodrop-frontend \
  --image ghcr.io/your-username/gotodrop/front:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 80
```

#### GKE (Google Kubernetes Engine)

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gotodrop-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: gotodrop-backend
  template:
    metadata:
      labels:
        app: gotodrop-backend
    spec:
      containers:
        - name: backend
          image: ghcr.io/your-username/gotodrop/back:latest
          ports:
            - containerPort: 8080
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: docker,prod
---
apiVersion: v1
kind: Service
metadata:
  name: gotodrop-backend-service
spec:
  selector:
    app: gotodrop-backend
  ports:
    - port: 80
      targetPort: 8080
  type: LoadBalancer
```

### Microsoft Azure

#### Container Instances

```bash
# Créer un groupe de ressources
az group create --name gotodrop-rg --location westeurope

# Déployer le backend
az container create \
  --resource-group gotodrop-rg \
  --name gotodrop-backend \
  --image ghcr.io/your-username/gotodrop/back:latest \
  --ports 8080 \
  --dns-name-label gotodrop-backend-unique \
  --environment-variables SPRING_PROFILES_ACTIVE=docker,prod

# Déployer le frontend
az container create \
  --resource-group gotodrop-rg \
  --name gotodrop-frontend \
  --image ghcr.io/your-username/gotodrop/front:latest \
  --ports 80 \
  --dns-name-label gotodrop-frontend-unique
```

#### App Service

```bash
# Créer un App Service Plan
az appservice plan create \
  --name gotodrop-plan \
  --resource-group gotodrop-rg \
  --sku B1 \
  --is-linux

# Créer une Web App
az webapp create \
  --resource-group gotodrop-rg \
  --plan gotodrop-plan \
  --name gotodrop-backend-app \
  --deployment-container-image-name ghcr.io/your-username/gotodrop/back:latest
```

---

## 🔄 GitHub Actions (automatique)

### Configuration des secrets

Dans votre repository GitHub, allez dans **Settings > Secrets and variables > Actions** :

#### Secrets obligatoires

```
SSH_PRIVATE_KEY          # Clé SSH pour déploiement serveur
SSH_HOST                 # IP ou domaine du serveur
SSH_USERNAME            # Nom d'utilisateur SSH
```

#### Secrets optionnels

```
SONAR_TOKEN             # Token SonarCloud
SLACK_WEBHOOK_URL       # Notifications Slack
DOCKER_USERNAME         # Si vous utilisez Docker Hub
DOCKER_PASSWORD         # Token Docker Hub
```

### Workflow de déploiement personnalisé

Créez `.github/workflows/deploy-custom.yml` :

```yaml
name: 🚀 Déploiement personnalisé

on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Environnement de déploiement"
        required: true
        default: "staging"
        type: choice
        options:
          - staging
          - production
      version:
        description: "Version à déployer"
        required: true
        default: "latest"

jobs:
  deploy:
    name: 🚀 Déployer sur ${{ github.event.inputs.environment }}
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4

      - name: 🔐 Setup SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: 🚀 Deploy to server
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.SSH_USERNAME }}@${{ secrets.SSH_HOST }} << 'EOF'
            cd /opt/gotodrop
            
            # Sauvegarder la version actuelle
            docker-compose ps > backup_$(date +%Y%m%d_%H%M%S).txt
            
            # Arrêter les services
            docker-compose down
            
            # Mettre à jour les images
            docker pull ghcr.io/${{ github.repository }}/back:${{ github.event.inputs.version }}
            docker pull ghcr.io/${{ github.repository }}/front:${{ github.event.inputs.version }}
            
            # Démarrer avec la nouvelle version
            export BACKEND_IMAGE=ghcr.io/${{ github.repository }}/back:${{ github.event.inputs.version }}
            export FRONTEND_IMAGE=ghcr.io/${{ github.repository }}/front:${{ github.event.inputs.version }}
            docker-compose up -d
            
            # Vérifier que tout fonctionne
            sleep 30
            curl -f http://localhost:8080/actuator/health || exit 1
          EOF

      - name: 📢 Notify success
        if: success()
        run: echo "✅ Déploiement réussi sur ${{ github.event.inputs.environment }}"
```

### Rollback automatique

```yaml
name: 🔄 Rollback

on:
  workflow_dispatch:
    inputs:
      version:
        description: "Version vers laquelle revenir"
        required: true

jobs:
  rollback:
    name: 🔄 Rollback vers ${{ github.event.inputs.version }}
    runs-on: ubuntu-latest

    steps:
      - name: 🔄 Rollback on server
        run: |
          ssh ${{ secrets.SSH_USERNAME }}@${{ secrets.SSH_HOST }} << 'EOF'
            cd /opt/gotodrop
            docker-compose down
            export BACKEND_IMAGE=ghcr.io/${{ github.repository }}/back:${{ github.event.inputs.version }}
            export FRONTEND_IMAGE=ghcr.io/${{ github.repository }}/front:${{ github.event.inputs.version }}
            docker-compose up -d
          EOF
```

---

## 📊 Monitoring et maintenance

### Health checks

```bash
# Script de surveillance
cat > /opt/gotodrop/health-check.sh << 'EOF'
#!/bin/bash

API_URL="http://localhost:8080/actuator/health"
FRONTEND_URL="http://localhost:3000"

# Vérifier l'API
if curl -f "$API_URL" > /dev/null 2>&1; then
    echo "✅ API OK"
else
    echo "❌ API DOWN"
    # Redémarrer l'API
    docker-compose restart backend
fi

# Vérifier le frontend
if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
    echo "✅ Frontend OK"
else
    echo "❌ Frontend DOWN"
    # Redémarrer le frontend
    docker-compose restart frontend
fi
EOF

chmod +x /opt/gotodrop/health-check.sh

# Exécuter toutes les 5 minutes
echo "*/5 * * * * /opt/gotodrop/health-check.sh" | crontab -
```

### Logs centralisés

```bash
# Configuration Logrotate
sudo tee /etc/logrotate.d/gotodrop << EOF
/opt/gotodrop/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose restart backend frontend
    endscript
}
EOF
```

### Métriques Prometheus

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "gotodrop-backend"
    static_configs:
      - targets: ["backend:8080"]
    metrics_path: "/actuator/prometheus"
    scrape_interval: 15s

  - job_name: "docker"
    static_configs:
      - targets: ["localhost:9323"]
```

---

## 🆘 Dépannage

### Problèmes courants

#### 1. Service ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend
docker-compose logs frontend

# Vérifier la configuration
docker-compose config

# Reconstruire les images
docker-compose build --no-cache
```

#### 2. Base de données corrompue

```bash
# Sauvegarder
cp -r /opt/gotodrop/data /opt/gotodrop/data.backup

# Redémarrer avec une DB propre
docker-compose down
docker volume rm gotodrop_backend-data-prod
docker-compose up -d
```

#### 3. Certificat SSL expiré

```bash
# Renouveler Let's Encrypt
sudo certbot renew
sudo systemctl reload nginx
```

#### 4. Espace disque insuffisant

```bash
# Nettoyer Docker
docker system prune -a

# Nettoyer les logs
sudo journalctl --vacuum-time=7d

# Nettoyer les sauvegardes anciennes
find /opt/gotodrop/backups -mtime +30 -delete
```

### Commandes de diagnostic

```bash
# Statut global
docker-compose ps
docker stats --no-stream

# Espace disque
df -h
docker system df

# Mémoire
free -h
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Réseau
netstat -tlnp | grep -E "(80|443|8080)"
```

---

Ce guide couvre la plupart des scénarios de déploiement. Pour des besoins spécifiques, consultez la documentation officielle de chaque plateforme.
