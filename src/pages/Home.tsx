import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { Navbar } from "../components/Navbar";
import { useAppLanguage } from "../components/AppLanguage";
import { useAuthStore } from "../services/state/useAuthStore";
import "../styles/pages/home.css";

function normalizeSessionCode(value: string) {
  return value.trim().toUpperCase();
}

export function Home() {
  const { user } = useAuthStore();
  const { copy } = useAppLanguage();
  const [sessionCode, setSessionCode] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const inviteMessage = useMemo(() => {
    const code = normalizeSessionCode(sessionCode);
    const baseUrl = window.location.origin;
    const dashboardUrl = `${baseUrl}/dashboard`;
    return code
      ? copy.home.inviteMessageWithCode
          .replace("{{code}}", code)
          .replace("{{url}}", dashboardUrl)
      : copy.home.inviteMessageWithoutCode.replace("{{url}}", dashboardUrl);
  }, [copy.home.inviteMessageWithCode, copy.home.inviteMessageWithoutCode, sessionCode]);

  const whatsappUrl = useMemo(() => {
    return `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;
  }, [inviteMessage]);

  const inviteLink = useMemo(() => {
    const code = normalizeSessionCode(sessionCode);
    const baseUrl = window.location.origin;
    return code ? `${baseUrl}/dashboard?session=${code}` : `${baseUrl}/dashboard`;
  }, [sessionCode]);

  const handleGenerateCode = (e: FormEvent) => {
    e.preventDefault();
    setSessionCode((current) => normalizeSessionCode(current));
  };

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(`${inviteMessage}\n${inviteLink}`);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <div className="home-page">
      <div className="home-bg-orb home-bg-orb-one" aria-hidden />
      <div className="home-bg-orb home-bg-orb-two" aria-hidden />
      <div className="home-grid" aria-hidden />

      <Navbar variant="home" />

      <main className="home-hero home-section">
        <p className="home-kicker">CoBIM Cloud</p>
        <h1>{copy.home.heroTitle}</h1>
        <p className="home-subtitle">{copy.home.heroSubtitle}</p>

        <div className="home-hero-actions">
          <Link
            className="home-btn home-btn-primary home-btn-lg"
            to={user ? "/dashboard" : "/register"}
          >
            {user ? copy.home.openWorkspace : copy.home.createWorkspace}
          </Link>
          <Link className="home-btn home-btn-ghost home-btn-lg" to="/login">
            {user ? copy.home.switchAccount : copy.home.signIn}
          </Link>
        </div>
      </main>

      <section className="home-invite home-section">
        <div className="home-invite-copy">
          <p className="home-section-label">{copy.home.inviteLabel}</p>
          <h2>{copy.home.inviteTitle}</h2>
          <form className="home-session-form" onSubmit={handleGenerateCode}>
            <label htmlFor="sessionCode" className="home-field-label">
              {copy.home.sessionCode}
            </label>
            <input
              id="sessionCode"
              className="home-session-input"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              placeholder={copy.home.sessionCodePlaceholder}
              maxLength={12}
            />
            <div className="home-invite-actions">
              <button className="home-btn home-btn-primary" type="submit">
                {copy.home.normalizeCode}
              </button>
              <button
                className="home-btn home-btn-ghost"
                type="button"
                onClick={handleCopyInvite}
              >
                {copy.home.copyInvite}
              </button>
              <a
                className="home-btn home-btn-ghost"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                {copy.home.whatsapp}
              </a>
            </div>
            <p className={`home-copy-state home-copy-state-${copyState}`}>
              {copyState === "copied"
                ? copy.home.inviteCopied
                : copyState === "error"
                  ? copy.home.inviteCopyFailed
                  : " "}
            </p>
          </form>
        </div>

        <div className="home-invite-side">
          <div className="home-invite-link">
            <span>{copy.home.inviteLink}</span>
            <code>{inviteLink}</code>
          </div>
          <div className="home-mini-grid">
            <div className="home-mini-card">
              <Icon name="users" />
              <span>{copy.home.sharedSession}</span>
            </div>
            <div className="home-mini-card">
              <Icon name="chat" />
              <span>{copy.home.whatsappShare}</span>
            </div>
            <div className="home-mini-card">
              <Icon name="eye" />
              <span>{copy.home.review3d}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
