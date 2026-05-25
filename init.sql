-- Table des Utilisateurs
CREATE TABLE Utilisateurs (
    id SERIAL PRIMARY KEY,
    pseudo VARCHAR(50) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des Sondages
CREATE TABLE Sondages (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    id_auteur INTEGER REFERENCES Utilisateurs(id) ON DELETE CASCADE,
    code_partage VARCHAR(100) UNIQUE NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des Options
CREATE TABLE Options (
    id SERIAL PRIMARY KEY,
    id_sondage INTEGER REFERENCES Sondages(id) ON DELETE CASCADE,
    libelle VARCHAR(255) NOT NULL
);

-- Table des Votes (anti-double vote inclus)
CREATE TABLE Votes (
    id SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES Utilisateurs(id),
    id_sondage INTEGER REFERENCES Sondages(id) ON DELETE CASCADE,
    id_option INTEGER REFERENCES Options(id) ON DELETE CASCADE,
    date_vote TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_vote_utilisateur_sondage UNIQUE (id_utilisateur, id_sondage)
);
