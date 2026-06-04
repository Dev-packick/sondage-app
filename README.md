# Sondage App
Application web de sondages collaboratifs - Projet CTF BACH
## Équipe

API : Lead / Chef de projet
Bénie : Reviewer (Qualité du code)
Patrick : DevOps (Docker, Base de données, Organisation du projet)
Adrien : Dev Frontend (Interface utilisateur)
Umair : Dev Backend (API, Logique métier)
## Stack technique
- **Frontend** : React + React Router + Axios
- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL
- **Infrastructure** : Docker + Docker Compose
- **Déploiement** : Render

## Modèle de données (MPD)
Utilisateurs (id, pseudo, mot_de_passe, date_inscription) 
Sondages (id, titre, id_auteur FK, code_partage UNIQUE, date_creation)
Options (id, id_sondage FK, libelle)
Votes (id, id_utilisateur FK, id_sondage FK, id_option FK, date_vote)
UNIQUE (id_utilisateur, id_sondage) - anti-double vote

## Lancer le projet en local
### Prérequis
- Docker et Docker Compose installés
- Node.js installé

### Option 1 - Sans Docker (développement)

Terminal 1 - Base de données uniquement :
```bash
docker-compose up -d db

Terminal 2 - Backend :
```bash
cd backend
npm install
node index.js

Terminal 3 - Frontend :
```bash
cd frontend
npm install
npm start

- Frontend : http://localhost:3000
- Backend : http://localhost:3001


### Option 2 - Avec Docker complet
```bash
docker-compose up --build

- Application : http://localhost
## Fonctionnalités
- [x] Inscription et connexion sécurisée (mot de passe chiffré)
- [x] Créer un sondage avec plusieurs options
- [x] Voter (une seule fois par sondage - anti-double vote)
- [x] Voir les résultats
- [x] Copier le lien de partage d'un sondage
- [ ] Résultats en temps réel via WebSockets (en cours)


## Problèmes rencontrés
Au démarrage du projet, une mauvaise compréhension des rôles et une structure
initiale incomplète ont conduit à une réunion d'équipe le 24/05/2026.
Cette réunion a abouti à une reprise complète du projet : nouveau repo,
modèle de données revu, workflow GitHub clarifié et plan de travail
redistribué à chaque membre selon ses responsabilités.
## Application en ligne
