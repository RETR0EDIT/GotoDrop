# Configuration GitHub Actions

Ce fichier explique comment configurer les secrets et variables nécessaires pour les workflows GitHub Actions.

## 🔐 Secrets à configurer

Allez dans **Settings > Secrets and variables > Actions** de votre repository GitHub et ajoutez :

### Secrets obligatoires

1. **SSH_PRIVATE_KEY**

   - Clé SSH privée pour le déploiement sur serveur distant
   - Générez avec : `ssh-keygen -t ed25519 -C "github-actions"`

2. **SONAR_TOKEN** (optionnel)
   - Token pour SonarCloud
   - Obtenez-le sur : https://sonarcloud.io/account/security

### Variables d'environnement

1. **API_URL**

   - URL de l'API en production
   - Exemple : `https://api.gotodrop.com`

2. **DB_PASSWORD**
   - Mot de passe de la base de données en production

## 🏗️ Configuration du registry Docker

Les workflows utilisent GitHub Container Registry (ghcr.io) par défaut.

### Pour utiliser Docker Hub à la place :

1. Changez `REGISTRY: ghcr.io` par `REGISTRY: docker.io`
2. Ajoutez ces secrets :
   - **DOCKER_USERNAME** : Votre nom d'utilisateur Docker Hub
   - **DOCKER_PASSWORD** : Votre token d'accès Docker Hub

## 🌍 Environnements GitHub

Configurez les environnements dans **Settings > Environments** :

### Environment "production"

- **Protection rules** : Require reviewers
- **Environment secrets** :
  - `SSH_PRIVATE_KEY`
  - `DB_PASSWORD`
  - `API_URL`

## 🔧 Personnalisation des workflows

### Pour modifier les déclencheurs :

```yaml
on:
  push:
    branches: [main, develop] # Ajoutez vos branches
  pull_request:
    branches: [main]
  workflow_dispatch: # Déclenchement manuel
```

### Pour changer les versions Java/Node :

```yaml
strategy:
  matrix:
    java-version: [17, 21] # Versions Java à tester
    node-version: [18, 20] # Versions Node à tester
```

## 📊 Monitoring et notifications

### Intégrations disponibles :

1. **Slack** : Ajoutez `SLACK_WEBHOOK_URL`
2. **Discord** : Ajoutez `DISCORD_WEBHOOK_URL`
3. **Teams** : Ajoutez `TEAMS_WEBHOOK_URL`
4. **Email** : Configurez dans Settings > Notifications

### Exemple notification Slack :

```yaml
- name: 📢 Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: "#deployments"
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 🚀 Première utilisation

1. **Forkez** ou **clonez** le repository
2. **Configurez** les secrets nécessaires
3. **Pushez** sur la branche main pour déclencher le premier build
4. **Créez** un tag pour déclencher une release : `git tag v1.0.0 && git push origin v1.0.0`

## 🔍 Débogage

### Voir les logs des workflows :

- Allez dans l'onglet **Actions** de votre repository
- Cliquez sur un workflow pour voir les détails
- Téléchargez les artifacts si nécessaire

### Tester localement avec act :

```bash
# Installer act
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Tester un workflow
act -j test
```
