import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

const API = import.meta.env.VITE_API_URL;

export default function CreerSondage() {
  const [titre, setTitre] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ajouterOption = () => {
    if (options.length >= 8) return alert("Maximum 8 options");
    setOptions([...options, ""]);
  };

  const modifierOption = (index, valeur) => {
    const maj = [...options];
    maj[index] = valeur;
    setOptions(maj);
  };

  const supprimerOption = (index) => {
    if (options.length <= 2) return alert("Minimum 2 options");
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleCreer = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Connecte-toi d'abord");
    if (!titre.trim()) return alert("Ajoute un titre");
    const optionsFiltrees = options.filter((o) => o.trim() !== "");
    if (optionsFiltrees.length < 2) return alert("Minimum 2 options");
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/sondages`,
        { titre, options: optionsFiltrees },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate(`/sondage/${res.data.id}`);
    } catch {
      alert("Erreur lors de la creation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card card-md">
        <Link to="/" className="back-link">
          ← Retour
        </Link>

        <h1 className="page-title">Nouveau sondage</h1>
        <p className="page-subtitle">
          Cree ton sondage et partage-le en un clic.
        </p>

        <div className="field">
          <label>Titre du sondage</label>
          <input
            className="input"
            placeholder="Ex: Ou partir en vacances ?"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
        </div>

        <hr className="section-sep" />

        <p className="section-label">Options de vote</p>

        {options.map((opt, i) => (
          <div className="option-row" key={i}>
            <div className="option-number">{i + 1}</div>
            <input
              className="input"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => modifierOption(i, e.target.value)}
              style={{ flex: 1 }}
            />
            {options.length > 2 && (
              <button
                onClick={() => supprimerOption(i)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontSize: "1.1rem",
                  padding: "4px",
                  lineHeight: 1,
                  transition: "color 0.15s",
                }}
                onMouseOver={(e) => (e.target.style.color = "var(--danger)")}
                onMouseOut={(e) => (e.target.style.color = "var(--text-muted)")}
              >
                ×
              </button>
            )}
          </div>
        ))}

        <button
          className="btn btn-secondary"
          onClick={ajouterOption}
          style={{ marginTop: 4, marginBottom: 28 }}
        >
          + Ajouter une option
        </button>

        <button
          className="btn btn-primary"
          onClick={handleCreer}
          disabled={loading}
        >
          {loading ? "Creation en cours..." : "Creer le sondage"}
        </button>
      </div>
    </div>
  );
}
