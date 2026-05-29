import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

const API = import.meta.env.VITE_API_URL;

export default function Connexion() {
  const [pseudo, setPseudo] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnexion = async () => {
    if (!pseudo.trim() || !motDePasse.trim())
      return alert("Remplis tous les champs");
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card card-sm">
        <p className="page-title">Bon retour.</p>
        <p className="page-subtitle">
          Connecte-toi pour acceder a tes sondages.
        </p>

        <div className="field">
          <label>Pseudo</label>
          <input
            className="input"
            placeholder="ton_pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnexion()}
          />
        </div>

        <div className="field">
          <label>Mot de passe</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnexion()}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleConnexion}
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div className="auth-footer">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="link">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
