import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { InterviewHub } from "./pages/InterviewHub";
import { InterviewStart } from "./pages/InterviewStart";
import { InterviewWorkspace } from "./pages/InterviewWorkspace";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ResumePage } from "./pages/ResumePage";
import { CoachPage } from "./pages/CoachPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/interview" element={<InterviewHub />} />
            <Route path="/interview/start" element={<InterviewStart />} />
            <Route path="/interview/session/:sessionId" element={<InterviewWorkspace />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/coach" element={<CoachPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
