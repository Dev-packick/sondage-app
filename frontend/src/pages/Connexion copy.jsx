import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Connexion() {
  const [pseudo, setPseudo] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const navigate = useNavigate();

  const handleConnexion = async () => {
    try {
      const res = await axios.post(`${API}/api/connexion`, {
        pseudo,
        mot_de_passe: motDePasse,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("pseudo", res.data.pseudo);
      navigate("/");
    } catch {
      alert("Mauvais identifiants");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Connexion - Sondage App</h2>
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
      <button onClick={handleConnexion}>Se connecter</button>
      <p>
        Pas de compte ? <a href="/inscription">S'inscrire</a>
      </p>
    </div>
  );
}
