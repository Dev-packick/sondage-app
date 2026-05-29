import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

const API = import.meta.env.VITE_API_URL;

export default function Inscription() {
  const [pseudo, setPseudo] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInscription = async () => {
    if (!pseudo.trim() || !motDePasse.trim())
      return alert("Remplis tous les champs");
    if (motDePasse.length < 4)
      return alert("Mot de passe trop court (min. 4 caracteres)");
    setLoading(true);
    try {
      await axios.post(`${API}/api/inscription`, {
        pseudo,
        mot_de_passe: motDePasse,
      });
      alert("Compte cree ! Connecte-toi.");
      navigate("/connexion");
    } catch {
      alert("Pseudo deja pris");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card card-sm">
        <p className="page-title">Creer un compte.</p>
        <p className="page-subtitle">
          Rejoins l'app pour creer et voter dans des sondages.
        </p>

        <div className="field">
          <label>Pseudo</label>
          <input
            className="input"
            placeholder="ton_pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInscription()}
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
            onKeyDown={(e) => e.key === "Enter" && handleInscription()}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleInscription}
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? "Creation..." : "Creer mon compte"}
        </button>

        <div className="auth-footer">
          Deja un compte ?{" "}
          <Link to="/connexion" className="link">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
