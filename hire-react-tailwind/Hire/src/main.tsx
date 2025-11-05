import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import ProfilePage from "./pages/ProfilePage.tsx";
import Navbar from "./components/Navbar.tsx";
// import ServiceDashboard from "./pages/DashboardClient.tsx";

import DashboardPrestador from "./pages/DashboardPrestador.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ContractViewer from "./components/ContractViwer.tsx";
import {ContractPreview}  from "./components/ContractPreview.tsx";
import NegotiationRoom from "./components/NegotiationRoom.tsx";
import ScheduleConfigurator from "./components/Schedule.tsx";
import {ServiceCreationWizardModal} from "./components/ServiceCreator/ServiceCreationWizardModal.tsx"
import ServiceDashboard from "./components/ServiceEditor/ServiceEditor.tsx";
import  PostCard from "./components/ServiceGallery/Service/Service.tsx";
import ServiceDashboardSophisticated from "./pages/DashboardClient.tsx";


function ThemeWrapper() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "light"
      : "dark";
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
    <>
      {/* Navbar agora controla o tema */}
      <Navbar theme={theme} setTheme={setTheme} />

      {/* Conteúdo principal */}
      <AuthPage />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeWrapper />
  </StrictMode>
);
