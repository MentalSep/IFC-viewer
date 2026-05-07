import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./services/state/useAuthStore";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { ProjectViewer } from "./pages/ProjectViewer";
import { Teams } from "./pages/Teams";
import "./styles/global.css";

function App() {
  const { user, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects/:projectId" element={<ProjectViewer />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;