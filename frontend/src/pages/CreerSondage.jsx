import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function CreerSondage() {
  const [titre, setTitre] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const ajouterOption = () => setOptions([...options, ""]);

  const modifierOption = (index, valeur) => {
    const maj = [...options];
    maj[index] = valeur;
    setOptions(maj);
  };

  const handleCreer = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Connecte-toi d'abord");
    if (!titre.trim()) return alert("Ajoute un titre");
    const optionsFiltrees = options.filter((o) => o.trim() !== "");
    if (optionsFiltrees.length < 2) return alert("Minimum 2 options");
    try {
      const res = await axios.post(
        `${API}/api/sondages`,
        { titre, options: optionsFiltrees },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate(`/sondage/${res.data.id}`);
    } catch {
      alert("Erreur lors de la creation");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Creer un sondage</h2>
      <input
        placeholder="Titre du sondage"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        style={{ width: 300 }}
      />
      <br />
      <br />
      <h4>Options (minimum 2) :</h4>
      {options.map((opt, i) => (
        <div key={i}>
          <input
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => modifierOption(i, e.target.value)}
          />
          <br />
          <br />
        </div>
      ))}
      <button onClick={ajouterOption}>+ Ajouter une option</button>
      <br />
      <br />
      <button onClick={handleCreer}>Creer le sondage</button>
      <br />
      <br />
      <Link to="/">Retour</Link>
    </div>
  );
}
