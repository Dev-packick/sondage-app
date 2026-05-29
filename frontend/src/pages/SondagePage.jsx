import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function SondagePage() {
  const { id } = useParams();
  const [sondage, setSondage] = useState(null);
  const [resultats, setResultats] = useState([]);

  const chargerResultats = () => {
    setResultats([
      { libelle: "Option A", votes: 3 },
      { libelle: "Option B", votes: 7 },
    ]);
  };

  useEffect(() => {
    // MOCK SONDDAGE (sans backend)
    setSondage({
      id,
      titre: "Sondage test front only",
      options: [
        { id: 1, libelle: "Option A" },
        { id: 2, libelle: "Option B" },
      ],
    });

    chargerResultats();
  }, [id]);

  const voter = (id_option) => {
    alert("Vote simulé (front only)");
    console.log("Vote option:", id_option);
  };

  const copierLien = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Lien copié !");
  };

  if (!sondage) return <p style={{ padding: 40 }}>Chargement...</p>;

  return (
    <div style={{ padding: 40 }}>
      <Link to="/">Retour</Link>

      <h2>{sondage.titre}</h2>

      <button onClick={copierLien}>Copier le lien de partage</button>

      <hr />

      <h3>Voter :</h3>

      {sondage.options?.map((opt) => (
        <div key={opt.id} style={{ marginBottom: 8 }}>
          <button onClick={() => voter(opt.id)}>{opt.libelle}</button>
        </div>
      ))}

      <hr />

      <h3>Résultats :</h3>

      {resultats.map((r) => (
        <p key={r.libelle}>
          {r.libelle} : <strong>{r.votes} vote(s)</strong>
        </p>
      ))}
    </div>
  );
}
