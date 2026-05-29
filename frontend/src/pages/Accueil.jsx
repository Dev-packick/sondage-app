import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

const API = import.meta.env.VITE_API_URL;

export default function Accueil() {
  const [sondages, setSondages] = useState([]);
  const navigate = useNavigate();
  const pseudo = localStorage.getItem("pseudo");

  useEffect(() => {
    setSondages([{ id: 1, titre: "Sondage test", auteur: "Mock" }]);
  }, []);

  const deconnexion = () => {
    localStorage.clear();
    navigate("/connexion");
  };

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar card-lg">
        <span className="navbar-brand">Sondage App</span>
        <div className="navbar-right">
          {pseudo ? (
            <>
              <div className="user-chip">
                <div className="user-avatar">{pseudo[0]}</div>
                {pseudo}
              </div>
              <button className="btn btn-danger" onClick={deconnexion}>
                Deconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="btn btn-ghost">
                Se connecter
              </Link>
              <Link to="/inscription" className="btn btn-secondary">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main card */}
      <div className="card card-lg">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>
              Les sondages
            </h1>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              {sondages.length} sondage{sondages.length !== 1 ? "s" : ""}{" "}
              disponible{sondages.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "auto" }}
            onClick={() => navigate("/creer")}
          >
            + Nouveau sondage
          </button>
        </div>

        {sondages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>Aucun sondage pour l'instant.</p>
            <p style={{ marginTop: 8 }}>
              <button
                className="btn btn-outline"
                style={{ marginTop: 12 }}
                onClick={() => navigate("/creer")}
              >
                Creer le premier
              </button>
            </p>
          </div>
        ) : (
          <div className="sondage-list">
            <p className="section-label">Tous les sondages</p>
            {sondages.map((s) => (
              <Link to={`/sondage/${s.id}`} key={s.id} className="sondage-item">
                <div>
                  <div className="sondage-item-title">{s.titre}</div>
                  <div className="sondage-item-meta">par {s.auteur}</div>
                </div>
                <span className="sondage-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
