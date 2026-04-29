import React, { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../services/state/useAuthStore";
import "../styles/pages/auth.css";

export function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div style={{ marginBottom: "1rem" }}>
          <h1>🏗️ CoBIM Cloud</h1>
          <p className="subtitle">Enterprise BIM Collaboration Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {(error || localError) && (
            <div className="error-message">
              <strong>⚠️ Error:</strong> {error || localError}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-link">
          New to CoBIM Cloud? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
