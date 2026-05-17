import { Link } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { useAuthStore } from "../services/state/useAuthStore";
import "../styles/pages/home.css";

const features = [
  {
    title: "Interactive IFC Viewer",
    text: "Navigate complex BIM models with smooth camera controls, model trees, and quick tools.",
    icon: "cube" as const,
  },
  {
    title: "Live Team Collaboration",
    text: "Use project chat and element comments to review design issues together in context.",
    icon: "chat" as const,
  },
  {
    title: "Session-aware Workspace",
    text: "Return to your previous project setup with restored viewer preferences and layout.",
    icon: "bolt" as const,
  },
];

const cdeSpaces = [
  {
    area: "WIP",
    users: "Concepteur seul",
    rights: "Lecture / Ecriture",
    role: "Zone de travail privee, non visible",
  },
  {
    area: "Shared",
    users: "Equipe projet",
    rights: "Lecture + Commentaire",
    role: "Coordination et detection de clashs",
  },
  {
    area: "Published",
    users: "Chantier + MOA + MOE",
    rights: "Lecture seule",
    role: "Documents contractuels, seule version valide",
  },
  {
    area: "Archive",
    users: "Admin Projet",
    rights: "Acces restreint",
    role: "Tracabilite legale et historique",
  },
];

const modules = [
  {
    title: "Module A - 3D Viewer & Coordination BIM",
    points: [
      "Interop .rvt, .ifc, .nwd, .dwg, .dgn, .landxml, .pdf 3D",
      "Clash detection intelligente + analyses nocturnes automatisees",
      "Cycle de vie BCF 3.0 complet",
      "Controle georeferencement et rejet automatique si non conforme",
    ],
  },
  {
    title: "Module B - 4D Simulation & Planning",
    points: [
      "Import planning MS Project, Primavera P6, Asta",
      "Liaison objet-tache simplifiee",
      "Player 4D avec export video .mp4",
      "Analyse predictive des incoherences de sequencement",
    ],
  },
  {
    title: "Module C - 5D Estimation & Controle des Couts",
    points: [
      "Bibliotheque BPU multi-sources Excel, multi-devises",
      "Quantitatif automatise et DQE instantane",
      "Dashboard financier live avec alertes de depassement",
      "Attachement digital chantier + generation situations PDF/XLS",
    ],
  },
];

export function Home() {
  const { user } = useAuthStore();

  return (
    <div className="home-page">
      <div className="home-bg-orb home-bg-orb-one" aria-hidden />
      <div className="home-bg-orb home-bg-orb-two" aria-hidden />
      <div className="home-grid" aria-hidden />

      <header className="home-nav">
        <div className="home-brand">
          <span className="home-brand-logo">
            <Icon name="building" />
          </span>
          <div>
            <h1>CoBIM Cloud</h1>
            <p>Common Data Environment ISO 19650</p>
          </div>
        </div>
        <div className="home-nav-actions">
          {user ? (
            <Link className="home-btn home-btn-primary" to="/dashboard">
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link className="home-btn home-btn-ghost" to="/login">
                Sign In
              </Link>
              <Link className="home-btn home-btn-primary" to="/register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="home-hero">
        <p className="home-kicker">CDE BIM 3D / 4D / 5D</p>
        <h2>Digitaliser et securiser la gestion des projets BTP, OA et Infra.</h2>
        <p className="home-subtitle">
          Notre promesse: eliminer les pertes financieres et les retards lies
          aux erreurs de conception, de coordination et de metre.
        </p>
        <div className="home-hero-actions">
          <Link
            className="home-btn home-btn-primary home-btn-lg"
            to={user ? "/dashboard" : "/register"}
          >
            {user ? "Continue to Workspace" : "Create Workspace"}
          </Link>
          <Link className="home-btn home-btn-ghost home-btn-lg" to="/login">
            {user ? "Switch Account" : "I already have an account"}
          </Link>
        </div>
      </main>

      <section className="home-features">
        {features.map((feature) => (
          <article key={feature.title} className="home-feature-card">
            <span className="home-feature-icon" aria-hidden>
              <Icon name={feature.icon} />
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <section className="home-blueprint">
        <h3>Vision Produit: un centre de pilotage, pas un cloud de stockage</h3>
        <p>
          CoBIM Cloud implemente le workflow CDE ISO 19650 avec validation
          parametrique avant publication: Dessinateur - Chef de projet - BIM
          Manager - Client.
        </p>

        <div className="home-cde-table-wrap">
          <table className="home-cde-table">
            <thead>
              <tr>
                <th>Espace</th>
                <th>Utilisateurs</th>
                <th>Droits</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {cdeSpaces.map((row) => (
                <tr key={row.area}>
                  <td>{row.area}</td>
                  <td>{row.users}</td>
                  <td>{row.rights}</td>
                  <td>{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="home-modules">
        {modules.map((module) => (
          <article key={module.title} className="home-module-card">
            <h4>{module.title}</h4>
            <ul>
              {module.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="home-requirements">
        <h3>Exigences techniques non negociables</h3>
        <p>
          API First, plugins Revit/Civil 3D, performance maquette federeree 2 Go
          en 4G, conformite RGPD et souverainete des donnees (Maroc/Europe).
        </p>
      </section>
    </div>
  );
}
