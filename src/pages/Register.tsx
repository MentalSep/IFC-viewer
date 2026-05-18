import React, { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../services/state/useAuthStore";
import { useAppLanguage } from "../components/AppLanguage";
import { AppFooter } from "../components/AppFooter";
import "../styles/pages/auth.css";

export function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const { copy } = useAppLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError(copy.auth.passwordsMismatch);
      return;
    }

    if (password.length < 6) {
      setLocalError(copy.auth.passwordTooShort);
      return;
    }

    try {
      await register(email, name, password);
      navigate("/dashboard");
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>CoBIM Cloud</h1>
            <p className="subtitle">{copy.auth.registerSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">{copy.auth.fullName}</label>
              <input
                id="name"
                type="text"
                placeholder={copy.auth.fullNamePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{copy.auth.email}</label>
              <input
                id="email"
                type="email"
                placeholder={copy.auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{copy.auth.password}</label>
              <input
                id="password"
                type="password"
                placeholder={copy.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">{copy.auth.confirmPassword}</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder={copy.auth.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {(error || localError) && (
              <div className="error-message">
                <strong>{copy.auth.errorPrefix}:</strong> {error || localError}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? copy.auth.creatingAccount : copy.auth.createAccount}
            </button>
          </form>

          <p className="auth-link">
            {copy.auth.alreadyHaveAccount}{" "}
            <Link to="/login">{copy.auth.signInHere}</Link>
          </p>
          <p className="auth-link auth-link-secondary">
            <Link to="/">{copy.auth.backHome}</Link>
          </p>
        </div>
      </div>
      <AppFooter />
    </>
  );
}
