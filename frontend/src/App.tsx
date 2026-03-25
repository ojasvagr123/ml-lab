import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import HousePage from "./pages/HousePage";
import CricketPage from "./pages/CricketPage";
import FlagPage from "./pages/FlagPage";
import AudioPage from "./pages/AudioPage";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/house" element={<HousePage />} />
          <Route path="/cricket" element={<CricketPage />} />
          <Route path="/flag" element={<FlagPage />} />
          <Route path="/audio" element={<AudioPage />} />
        </Routes>
      </main>
    </div>
  );
}