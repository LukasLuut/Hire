import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import DashboardPrestador from "./pages/DashboardPrestador";
import AuthPage from "./pages/AuthPage";
import ContractViewer from "./components/ContractViwer";
import { ContractPreview } from "./components/ContractPreview";
import NegotiationRoom from "./components/Negotiation/NegotiationRoom";
import ScheduleConfigurator from "./components/Schedule";
import { ServiceCreationWizardModal } from "./components/ServiceCreator/ServiceCreationWizardModal";
import ServiceDashboard from "./components/ServiceEditor/ServiceEditor";
import PostCard from "./components/ServiceGallery/Service/Service";
import ServiceDashboardSophisticated from "./pages/DashboardClient";
import { DemoServiceProgressContainer } from "./components/ServiceProgress";
import Accessibility from "./components/Accessibility";


export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const body = document.body;
    if (theme === "light") {
      body.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  }, [theme]);

  return (
    <Router>
      <Navbar theme={theme} setTheme={setTheme} />
      <Accessibility/>
      <Routes>
        {/* Página inicial */}
        
        <Route path="/" element={<DashboardPrestador />} />

        {/* Rotas principais */}
        <Route path="/home" element={<ProfilePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/buisness" element={<DashboardPrestador />} />
        <Route path="/client" element={<ServiceDashboardSophisticated />} />

      
        {/* Contratos */}
        {/* <Route path="/contract/viewer" element={<ContractViewer />} /> */}
        <Route path="/contract/preview" element={<ContractPreview />} />

        {/* Negociação e agendamento */}
        <Route path="/negotiation" element={<NegotiationRoom />} />
        <Route path="/schedule" element={<ScheduleConfigurator />} />

        {/* Rota fallback */}
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    </Router>
  );
}
