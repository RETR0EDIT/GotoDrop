# Build multi-étapes pour optimiser la taille de l'image

# Stage 1: Build de l'application
FROM eclipse-temurin:17-jdk-alpine AS builder

# Installer Maven
RUN apk add --no-cache maven

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier pom.xml et télécharger les dépendances
COPY pom.xml .

# Télécharger les dépendances Maven
RUN mvn dependency:go-offline -B

# Copier le code source
COPY src ./src

# Construire l'application
RUN mvn clean package -DskipTests

# Stage 2: Runtime avec image JRE légère
FROM eclipse-temurin:17-jre-alpine

# Installer curl et créer l'utilisateur en une seule couche
RUN apk add --no-cache curl && \
    addgroup -g 1000 app && \
    adduser -u 1000 -G app -s /bin/sh -D app

# Définir le répertoire de travail
WORKDIR /app

# Créer le répertoire de données
RUN mkdir -p /app/data && chown -R app:app /app

# Copier le JAR depuis le stage de build
COPY --from=builder --chown=app:app /app/target/gotodrop-api-0.0.1-SNAPSHOT.jar app.jar

# Basculer vers l'utilisateur non-root
USER app

# Exposer le port 8080
EXPOSE 8080

# Commande pour lancer l'application
CMD ["java", "-jar", "app.jar"]
