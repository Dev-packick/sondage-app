require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const { Pool } = require('pg'); 
const { v4: uuidv4 } = require('uuid'); 
 
const app = express(); 
app.use(cors()); 
app.use(express.json()); 
 
const pool = new Pool({ connectionString: process.env.DATABASE_URL }); 
const SECRET = process.env.JWT_SECRET; 
 
// Middleware auth 
function auth(req, res, next) { 
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) return res.status(401).json({ erreur: 'Non autorisé' }); 
  try { 
    req.utilisateur = jwt.verify(token, SECRET); 
    next(); 
  } catch { 
    res.status(401).json({ erreur: 'Token invalide' }); 
  } 
} 
 
// Test 
app.get('/', (req, res) => res.json({ message: 'sondage-app backend OK' })); 
 
// INSCRIPTION 
app.post('/api/inscription', async (req, res) => { 
  const { pseudo, mot_de_passe } = req.body; 
  const hache = await bcrypt.hash(mot_de_passe, 10); 
  try { 
    const result = await pool.query( 
      'INSERT INTO Utilisateurs (pseudo, mot_de_passe) VALUES ($1, $2) RETURNING id, pseudo', 
      [pseudo, hache] 
    ); 
    res.json(result.rows[0]); 
  } catch { 
    res.status(400).json({ erreur: 'Pseudo déjà pris' }); 
  } 
}); 
 
// CONNEXION
app.post('/api/connexion', async (req, res) => { 
  const { pseudo, mot_de_passe } = req.body; 
  const result = await pool.query( 
    'SELECT * FROM Utilisateurs WHERE pseudo = $1', 
    [pseudo] 
  ); 
  const utilisateur = result.rows[0]; 
  if (!utilisateur || !(await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe))) { 
    return res.status(401).json({ erreur: 'Mauvais identifiants' }); 
  } 
  const token = jwt.sign({ id: utilisateur.id, pseudo: utilisateur.pseudo }, SECRET); 
  res.json({ token, pseudo: utilisateur.pseudo }); 
}); 

// CRÉER UN SONDAGE 
app.post('/api/sondages', auth, async (req, res) => { 
  const { titre, options } = req.body; 
  const code_partage = uuidv4(); 
  try { 
    const sondage = await pool.query( 
      'INSERT INTO Sondages (titre, id_auteur, code_partage) VALUES ($1, $2, $3) RETURNING *', 
      [titre, req.utilisateur.id, code_partage] 
    ); 
    const id_sondage = sondage.rows[0].id; 
    for (const libelle of options) { 
      await pool.query( 
        'INSERT INTO Options (id_sondage, libelle) VALUES ($1, $2)', 
        [id_sondage, libelle] 
      ); 
    } 
    res.json(sondage.rows[0]); 
  } catch (e) { 
    res.status(500).json({ erreur: 'Erreur création sondage' }); 
  } 
}); 

// LISTE DES SONDAGES 
app.get('/api/sondages', async (req, res) => { 
  const result = await pool.query( 
    `SELECT s.*, u.pseudo as auteur 
     FROM Sondages s 
     JOIN Utilisateurs u ON s.id_auteur = u.id 
     ORDER BY s.date_creation DESC` 
  ); 
  res.json(result.rows); 
});

// UN SONDAGE PAR ID 
app.get('/api/sondages/:id', async (req, res) => { 
  const sondage = await pool.query( 
    'SELECT * FROM Sondages WHERE id = $1', 
    [req.params.id] 
  ); 
  if (!sondage.rows[0]) return res.status(404).json({ erreur: 'Sondage introuvable' }); 
  const options = await pool.query( 
    'SELECT * FROM Options WHERE id_sondage = $1', 
    [req.params.id] 
  ); 
  res.json({ ...sondage.rows[0], options: options.rows }); 
});

// SONDAGE PAR CODE DE PARTAGE 
app.get('/api/partage/:code', async (req, res) => { 
  const sondage = await pool.query( 
    'SELECT * FROM Sondages WHERE code_partage = $1', 
    [req.params.code] 
  ); 
  if (!sondage.rows[0]) return res.status(404).json({ erreur: 'Sondage introuvable' }); 
  const options = await pool.query( 
    'SELECT * FROM Options WHERE id_sondage = $1', 
    [sondage.rows[0].id] 
  ); 
  res.json({ ...sondage.rows[0], options: options.rows }); 
});


// VOTER 
app.post('/api/votes', auth, async (req, res) => { 
  const { id_sondage, id_option } = req.body; 
  try { 
    await pool.query( 
      'INSERT INTO Votes (id_utilisateur, id_sondage, id_option) VALUES ($1, $2, $3)', 
      [req.utilisateur.id, id_sondage, id_option] 
    ); 
    res.json({ message: 'Vote enregistré' }); 
  } catch { 
    res.status(400).json({ erreur: 'Vous avez déjà voté pour ce sondage' }); 
  } 
}); 

// RÉSULTATS 
app.get('/api/sondages/:id/resultats', async (req, res) => { 
  const resultats = await pool.query( 
    `SELECT o.libelle, COUNT(v.id) as votes 
     FROM Options o 
     LEFT JOIN Votes v ON v.id_option = o.id 
     WHERE o.id_sondage = $1 
     GROUP BY o.id, o.libelle 
     ORDER BY votes DESC`, 
    [req.params.id] 
  ); 
  res.json(resultats.rows); 
}); 
 
const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => console.log(`Backend lancé sur le port ${PORT}`)); 