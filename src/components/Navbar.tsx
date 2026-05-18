import { Link } from "react-router-dom";
import { Icon } from "./ui/Icon";
import { useAuthStore } from "../services/state/useAuthStore";
import { useAppLanguage } from "./AppLanguage";
import "../styles/components/navbar.css";

type NavbarVariant = "home" | "dashboard" | "project";

interface NavbarProps {
  variant?: NavbarVariant;
  projectTitle?: string;
}

export function Navbar({ variant = "home", projectTitle }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const { copy, cycleLocale, locale } = useAppLanguage();

  return (
    <header className={`navbar navbar-${variant}`}>
      <div className="navbar-brand">
        <Link className="navbar-brand-link" to="/">
          <span className="navbar-brand-logo" aria-hidden>
            <Icon name="building" />
          </span>
          <span className="navbar-brand-copy">
            <strong>CoBIM Cloud</strong>
            <span>
              {variant === "home"
                ? copy.navbar.homeTagline
                : copy.navbar.workspaceTagline}
            </span>
          </span>
        </Link>
      </div>

      <nav className="navbar-links" aria-label="Primary">
        {variant !== "home" && (
          <Link className="navbar-link" to="/">
            {copy.navbar.home}
          </Link>
        )}
        {variant === "project" && (
          <Link className="navbar-link" to="/dashboard">
            {copy.navbar.dashboard}
          </Link>
        )}
        {variant === "dashboard" && (
          <span className="navbar-crumb">{copy.navbar.workspaceDashboard}</span>
        )}
        {variant === "project" && projectTitle && (
          <span className="navbar-crumb navbar-project-title">{projectTitle}</span>
        )}
      </nav>

      <div className="navbar-actions">
        {user ? (
          <>
            {variant !== "dashboard" && (
              <Link className="navbar-action navbar-action-ghost" to="/dashboard">
                {copy.navbar.dashboard}
              </Link>
            )}
            {variant === "dashboard" && (
              <Link className="navbar-action navbar-action-ghost" to="/">
                {copy.navbar.home}
              </Link>
            )}
            <button
              className="navbar-action navbar-action-ghost"
              onClick={cycleLocale}
              title={copy.navbar.switchLanguage}
              aria-label={copy.navbar.switchLanguage}
            >
              {copy.localeLabel}: {copy.localeNames[locale]}
            </button>
            <span className="navbar-user">{user.name}</span>
            <button className="navbar-action navbar-action-ghost" onClick={logout}>
              {copy.navbar.logout}
            </button>
          </>
        ) : variant === "home" ? (
          <>
            <button
              className="navbar-action navbar-action-ghost"
              onClick={cycleLocale}
              title={copy.navbar.switchLanguage}
              aria-label={copy.navbar.switchLanguage}
            >
              {copy.localeLabel}: {copy.localeNames[locale]}
            </button>
            <Link className="navbar-action navbar-action-ghost" to="/login">
              {copy.navbar.signIn}
            </Link>
            <Link className="navbar-action navbar-action-primary" to="/register">
              {copy.navbar.getStarted}
            </Link>
          </>
        ) : (
          <>
            <button
              className="navbar-action navbar-action-ghost"
              onClick={cycleLocale}
              title={copy.navbar.switchLanguage}
              aria-label={copy.navbar.switchLanguage}
            >
              {copy.localeLabel}: {copy.localeNames[locale]}
            </button>
            <Link className="navbar-action navbar-action-ghost" to="/login">
              {copy.navbar.signIn}
            </Link>
            <Link className="navbar-action navbar-action-primary" to="/register">
              {copy.navbar.register}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
