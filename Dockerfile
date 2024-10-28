# Étape 1 : Construction du projet Angular
FROM ubuntu:focal as builder

# Mise à jour des paquets et installation de git
RUN apt update && apt install -y git && \
    git clone https://github.com/NotePhil/parcours.git /project

# Étape 2 : Construction de l'image finale
FROM node:17.0-bullseye-slim

# Création du répertoire de l'application
RUN mkdir /app

# Définition du répertoire de travail
WORKDIR /app

# Installation de l'Angular CLI
RUN npm install -g @angular/cli@13

# Copie des fichiers package.json et package-lock.json depuis l'étape builder
COPY --from=builder /project/package.json /project/package-lock.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste des fichiers du projet depuis l'étape builder
COPY --from=builder /project .

# Construction de l'application Angular en mode production
RUN npm run build --prod

# Définition du répertoire de travail pour le serveur HTTP
WORKDIR /app/dist/clinique

# Installation du serveur HTTP Angular
RUN npm install -g angular-http-server

# Commande d'entrée pour démarrer le serveur HTTP
ENTRYPOINT ["angular-http-server"]
