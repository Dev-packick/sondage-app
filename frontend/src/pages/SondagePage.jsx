import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../App.css";

const API = import.meta.env.VITE_API_URL;

export default function SondagePage() {
  const { id } = useParams();
  const [sondage, setSondage] = useState(null);
  const [resultats, setResultats] = useState([]);

  const totalVotes = resultats.reduce(
    (sum, r) => sum + parseInt(r.votes || 0),
    0,
  );

  const chargerResultats = () => {
    axios
      .get(`${API}/api/sondages/${id}/resultats`)
      .then((res) => setResultats(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    setSondage({
      id,
      titre: "Sondage test front only",
      options: [
        { id: 1, libelle: "Option A" },
        { id: 2, libelle: "Option B" },
      ],
    });

    setResultats([
      { libelle: "Option A", votes: 3 },
      { libelle: "Option B", votes: 7 },
    ]);
  }, [id]);

  const voter = async (id_option) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Connecte-toi pour voter");
    try {
      await axios.post(
        `${API}/api/votes`,
        { id_sondage: parseInt(id), id_option },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Vote enregistre !");
      chargerResultats();
    } catch (e) {
      alert(e.response?.data?.erreur || "Erreur de vote");
    }
  };

  const copierLien = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Lien copie !");
  };

  if (!sondage)
    return (
      <div className="page">
        <div
          className="card card-md"
          style={{ textAlign: "center", color: "var(--text-muted)" }}
        >
          Chargement...
        </div>
      </div>
    );

  return (
    <div className="page">
      <div className="card card-md">
        <Link to="/" className="back-link">
          ← Retour
        </Link>

        <h1 className="page-title">{sondage.titre}</h1>

        <div className="share-banner">
          <span>Partage ce sondage avec ton lien unique</span>
          <button
            className="btn btn-outline"
            style={{ padding: "6px 14px", fontSize: "0.82rem" }}
            onClick={copierLien}
          >
            Copier le lien
          </button>
        </div>

        {/* Vote */}
        <p className="section-label">Voter</p>
        {sondage.options?.map((opt) => (
          <button
            key={opt.id}
            className="vote-option"
            onClick={() => voter(opt.id)}
          >
            {opt.libelle}
            <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>Voter →</span>
          </button>
        ))}

        <hr className="section-sep" />

        {/* Resultats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <p className="section-label" style={{ margin: 0 }}>
            Resultats
          </p>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
          </span>
        </div>

        {resultats.length === 0 ? (
          <div className="empty-state" style={{ padding: "24px 0" }}>
            <p>Aucun vote pour l'instant.</p>
          </div>
        ) : (
          resultats.map((r) => {
            const pct =
              totalVotes > 0
                ? Math.round((parseInt(r.votes) / totalVotes) * 100)
                : 0;
            return (
              <div className="result-item" key={r.libelle}>
                <div className="result-header">
                  <span>{r.libelle}</span>
                  <span className="result-votes">
                    {r.votes} vote{parseInt(r.votes) !== 1 ? "s" : ""} · {pct}%
                  </span>
                </div>
                <div className="result-bar-bg">
                  <div className="result-bar" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
