import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

export default function Inscription() {
  const [pseudo, setPseudo] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const navigate = useNavigate();

  const handleInscription = async () => {
    try {
      await axios.post(`${API}/api/inscription`, {
        pseudo,
        mot_de_passe: motDePasse,
      });
      alert("Compte créé ! Connecte-toi.");
      navigate("/connexion");
    } catch {
      alert("Pseudo déjà pris");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Inscription - Sondage App</h2>
      <input
        placeholder="Pseudo"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
      />
      <br />
      <br />
      <input
        placeholder="Mot de passe"
        type="password"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleInscription}>S'inscrire</button>
      <p>
        Déjà un compte ? <a href="/connexion">Se connecter</a>
      </p>
    </div>
  );
}
