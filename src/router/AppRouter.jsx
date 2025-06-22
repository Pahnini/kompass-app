import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import DeinWegPage from "../pages/DeinWegPage";
import DesignsPage from "../pages/DesignsPage";
import GuidePage from "../pages/GuidePage";
import HomePage from "../pages/HomePage";
import NotfallPage from "../pages/NotfallPage";
import QuickEditPage from "../pages/QuickEditPage";
import SkillsPage from "../pages/SkillsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/deinweg" element={<DeinWegPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/designs" element={<DesignsPage />} />
        <Route path="/notfall" element={<NotfallPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/quickedit" element={<QuickEditPage />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
