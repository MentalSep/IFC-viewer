import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./services/state/useAuthStore";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { ProjectViewer } from "./pages/ProjectViewer";
import { AppLanguageProvider, useAppLanguage } from "./components/AppLanguage";
import "./styles/tailwind.css";
import "./styles/global.css";

function AppRoutes() {
  const { user, initialized, initializeAuth } = useAuthStore();
  const { copy } = useAppLanguage();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, []);

  if (!initialized) {
    return (
      <div className="app-boot">
        <div className="loading-spinner" aria-hidden />
        <p>{copy.app.restoringSession}</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects/:projectId" element={<ProjectViewer />} />
          </>
        ) : (
          <></>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <AppLanguageProvider>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </AppLanguageProvider>
  );
}

export default App;
