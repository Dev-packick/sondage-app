import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Accueil from "./pages/Accueil";
import CreerSondage from "./pages/CreerSondage";
import SondagePage from "./pages/SondagePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/connexion" />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/creer" element={<CreerSondage />} />
        <Route path="/sondage/:id" element={<SondagePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
