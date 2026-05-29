import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Accueil() {
  const [sondages, setSondages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const pseudo = localStorage.getItem("pseudo");

  useEffect(() => {
    setSondages([{ id: 1, titre: "Test sondage", auteur: "Mock" }]);
  }, []);

  const deconnexion = () => {
    localStorage.clear();
    navigate("/connexion");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Sondage App</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {pseudo ? (
        <p>
          Connecté : <strong>{pseudo}</strong> -{" "}
          <button onClick={deconnexion}>Déconnexion</button>
        </p>
      ) : (
        <p>
          <Link to="/connexion">Se connecter</Link> |{" "}
          <Link to="/inscription">S'inscrire</Link>
        </p>
      )}

      <button onClick={() => navigate("/creer")}>+ Créer un sondage</button>

      <hr />

      {sondages.length === 0 && <p>Aucun sondage pour l'instant.</p>}

      {sondages.map((s) => (
        <div key={s.id} style={{ marginBottom: 16 }}>
          <Link to={`/sondage/${s.id}`}>{s.titre}</Link>
          <span style={{ marginLeft: 10, color: "gray", fontSize: 12 }}>
            par {s.auteur}
          </span>
        </div>
      ))}
    </div>
  );
}
