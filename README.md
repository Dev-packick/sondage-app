#  Sondage App

Application web fullstack de création et de partage de sondages, avec authentification et vote en temps réel.

---

##  Fonctionnalités

- **Inscription / Connexion** — authentification sécurisée par JWT et mots de passe hashés (bcrypt)
- **Créer un sondage** — titre + options personnalisées, génération d'un lien de partage unique
- **Voter** — un seul vote par utilisateur et par sondage (contrainte en base de données)
- **Résultats** — visualisation du décompte des votes par option
- **Partage** — accès à un sondage via un code UUID partageable sans authentification

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, React Router v7, Axios, Vite |
| Backend | Node.js, Express 5 |
| Base de données | PostgreSQL 15 |
| Auth | JWT + bcryptjs |
| Conteneurisation | Docker, Docker Compose |
| Reverse proxy | Nginx |

---

## Structure du projet

```
sondage-app/
├── backend/
│   ├── index.js          # API REST Express
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── pages/
│   │       ├── Accueil.jsx
│   │       ├── Connexion.jsx
│   │       ├── Inscription.jsx
│   │       ├── CreerSondage.jsx
│   │       └── SondagePage.jsx
│   ├── nginx.conf
│   ├── package.json
│   └── Dockerfile
├── init.sql              # Schéma de base de données
└── docker-compose.yml
```

---

## Lancer le projet

### Prérequis

- [Docker](https://www.docker.com/) et Docker Compose installés

### Démarrage

```bash
git clone https://github.com/Dev-packick/sondage-app.git
cd sondage-app
docker compose up --build
```

L'application sera disponible sur :

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

### Arrêt

```bash
docker compose down
```

Pour supprimer aussi les données persistées :

```bash
docker compose down -v
```

---

## API — Endpoints

### Authentification

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/inscription` | Créer un compte |
| `POST` | `/api/connexion` | Se connecter, retourne un token JWT |

### Sondages

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| `GET` | `/api/sondages` |  | Lister tous les sondages |
| `GET` | `/api/sondages/:id` |  | Détail d'un sondage |
| `POST` | `/api/sondages` |  | Créer un sondage |
| `GET` | `/api/sondages/:id/resultats` |  | Résultats d'un sondage |
| `GET` | `/api/partage/:code` |  | Accéder à un sondage par code de partage |

### Votes

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| `POST` | `/api/votes` |  | Voter pour une option |

> Les routes protégées () nécessitent un header `Authorization: Bearer <token>`.

---

##  Schéma de base de données

```
Utilisateurs
├── id (PK)
├── pseudo (unique)
├── mot_de_passe
└── date_inscription

Sondages
├── id (PK)
├── titre
├── id_auteur (FK → Utilisateurs)
├── code_partage (unique UUID)
└── date_creation

Options
├── id (PK)
├── id_sondage (FK → Sondages)
└── libelle

Votes
├── id (PK)
├── id_utilisateur (FK → Utilisateurs)
├── id_sondage (FK → Sondages)
├── id_option (FK → Options)
├── date_vote
└── UNIQUE (id_utilisateur, id_sondage)   ← anti double-vote
```

---

##  Variables d'environnement

Le backend est configuré via Docker Compose. Pour un déploiement personnalisé, créez un fichier `.env` dans `backend/` :

```env
DATABASE_URL=postgresql://admin:admin123@db:5432/sondageapp
JWT_SECRET=votre_secret_jwt
PORT=3001
```

>  Pensez à changer `JWT_SECRET` et le mot de passe PostgreSQL avant tout déploiement en production.

---
