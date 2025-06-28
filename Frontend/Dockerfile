# Multi-stage build pour optimiser la taille de l'image

# Stage 1: Build de l'application
FROM node:20-alpine AS builder

# Installer pnpm globalement
RUN npm install -g pnpm

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json pnpm-lock.yaml* ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./

# Installer les dépendances avec pnpm
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY src/ ./src/
COPY public/ ./public/

# Construire l'application pour la production
RUN pnpm run build

# Stage 2: Servir l'application avec Nginx
FROM nginx:alpine

# Copier les fichiers construits depuis le stage précédent
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande par défaut (nginx démarre automatiquement)
CMD ["nginx", "-g", "daemon off;"]
