import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon, type IconName } from "../components/ui/Icon";
import { Navbar } from "../components/Navbar";
import { AppFooter } from "../components/AppFooter";
import { useAppLanguage } from "../components/AppLanguage";
import { useProjectsStore } from "../services/state/useProjectsStore";
import { useAuthStore } from "../services/state/useAuthStore";
import {
  PROJECT_ROLES,
  isProjectRole,
  type ProjectRole,
} from "../services/api/projectsApi";
import "../styles/pages/dashboard.css";

const LAST_PROJECT_KEY = "ifc_last_project_id";

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { copy } = useAppLanguage();
  const {
    projects,
    loading,
    error,
    fetch,
    subscribe,
    create,
    joinBySessionCode,
    deleteById,
  } = useProjectsStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [createError, setCreateError] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [joinRole, setJoinRole] = useState<ProjectRole>("Architect");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [lastProjectId, setLastProjectId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [inviteRoleByProject, setInviteRoleByProject] = useState<
    Record<string, ProjectRole>
  >({});
  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    fetch();
    const unsubscribe = subscribe();
    setLastProjectId(localStorage.getItem(LAST_PROJECT_KEY));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("session");
    const roleParam = params.get("role");
    if (code) {
      setSessionCode(code.toUpperCase());
    }
    if (roleParam && isProjectRole(roleParam)) {
      setJoinRole(roleParam);
    }
  }, [location.search]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    const trimmedName = newProjectName.trim();
    const trimmedDesc = newProjectDesc.trim();
    if (!trimmedName) {
      setCreateError(copy.dashboard.requiredProjectName);
      return;
    }

    setCreating(true);
    try {
      const newProject = await create(trimmedName, trimmedDesc);
      setNewProjectName("");
      setNewProjectDesc("");
      setShowCreateForm(false);
      localStorage.setItem(LAST_PROJECT_KEY, newProject.id);
      setLastProjectId(newProject.id);
      navigate(`/projects/${newProject.id}`);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenProject = (projectId: string) => {
    localStorage.setItem(LAST_PROJECT_KEY, projectId);
    setLastProjectId(projectId);
    navigate(`/projects/${projectId}`);
  };

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError("");
    const normalizedCode = sessionCode.trim().toUpperCase();
    if (!normalizedCode) {
      setJoinError(copy.dashboard.requiredSessionCode);
      return;
    }

    setJoining(true);
    try {
      const joinedProject = await joinBySessionCode(normalizedCode, joinRole);
      setSessionCode("");
      handleOpenProject(joinedProject.id);
    } catch (err: any) {
      setJoinError(err?.message || copy.dashboard.joinFailed);
    } finally {
      setJoining(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm(copy.dashboard.deleteConfirm)) return;
    setJoinError("");
    try {
      await deleteById(projectId);
      if (lastProjectId === projectId) {
        localStorage.removeItem(LAST_PROJECT_KEY);
        setLastProjectId(null);
      }
    } catch (err: any) {
      setJoinError(err?.message || copy.dashboard.deleteFailed);
    }
  };

  const getInviteRole = (projectId: string): ProjectRole =>
    inviteRoleByProject[projectId] ?? "Viewer";

  const buildWhatsappInvite = (projectId: string, sessionCodeValue: string) => {
    const role = getInviteRole(projectId);
    const roleParam = encodeURIComponent(role);
    const code = encodeURIComponent((sessionCodeValue || "").toUpperCase());
    const joinUrl = `${window.location.origin}/dashboard?session=${code}&role=${roleParam}`;
    const text = `${copy.dashboard.whatsappInviteText} (${role})\n${joinUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) => {
      const name = project.name.toLowerCase();
      const description = (project.description ?? "").toLowerCase();
      return name.includes(query) || description.includes(query);
    });
  }, [projects, projectSearch]);

  const dashboardStats = useMemo(() => {
    const totalDocuments = projects.reduce(
      (sum, project) => sum + (project.documentsCount ?? project.documents?.length ?? 0),
      0,
    );
    const totalMembers = projects.reduce((sum, project) => sum + (project.memberCount ?? 0), 0);
    const activeProjects = projects.filter((project) => project.status === "active").length;
    const latestProject = [...projects].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    )[0];
    return {
      totalDocuments,
      totalMembers,
      activeProjects,
      latestProject,
    };
  }, [projects]);

  return (
    <div className="dashboard">
      <Navbar variant="dashboard" />

      {/* Main Content */}
      <div className="dashboard-content">
        <motion.section
          className="dashboard-hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="dashboard-hero-copy">
            <span className="dashboard-eyebrow">{copy.dashboard.title}</span>
            <h1>{copy.dashboard.subtitle}</h1>
            <p>
              Manage BIM projects, documents, collaboration, and session access from one
              enterprise command center.
            </p>
          </div>
          <div className="dashboard-hero-panel">
            <div className="dashboard-hero-panel-title">Workspace status</div>
            <div className="dashboard-hero-value">{dashboardStats.activeProjects}</div>
            <div className="dashboard-hero-caption">active projects ready for review</div>
            {dashboardStats.latestProject && (
              <div className="dashboard-hero-meta">
                Latest: {dashboardStats.latestProject.name}
              </div>
            )}
          </div>
        </motion.section>

        <div className="dashboard-stats-grid">
          {(
            [
              {
                label: "Projects",
                value: projects.length,
                icon: "folder",
              hint: "shared BIM workspaces",
            },
            {
              label: "Documents",
              value: dashboardStats.totalDocuments,
              icon: "file",
              hint: "controlled project files",
            },
            {
              label: "Collaborators",
              value: dashboardStats.totalMembers,
              icon: "users",
              hint: "team seats connected",
            },
              {
                label: "Active sessions",
                value: dashboardStats.activeProjects,
                icon: "building",
                hint: "ready for live coordination",
              },
            ] as Array<{ label: string; value: number; icon: IconName; hint: string }>
          ).map((stat) => (
            <motion.div
              key={stat.label}
              className="dashboard-stat-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="dashboard-stat-icon">
                <Icon name={stat.icon} />
              </div>
              <div className="dashboard-stat-label">{stat.label}</div>
              <div className="dashboard-stat-value">{stat.value}</div>
              <div className="dashboard-stat-hint">{stat.hint}</div>
            </motion.div>
          ))}
        </div>

        <div className="dashboard-lanes">
          <section className="dashboard-lane">
            <div className="dashboard-lane-header">
              <div>
                <h3>Recent projects</h3>
                <p>Open a workspace or resume your last session.</p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setProjectSearch("")}
              >
                Clear filters
              </button>
            </div>
            {filteredProjects.length > 0 && (
              <div className="dashboard-recent-list">
                {filteredProjects.slice(0, 3).map((project) => (
                  <button
                    key={project.id}
                    className="dashboard-recent-item"
                    onClick={() => handleOpenProject(project.id)}
                  >
                    <div>
                      <strong>{project.name}</strong>
                      <span>{project.description || copy.dashboard.noDescription}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-lane dashboard-lane-side">
            <div className="dashboard-lane-header">
              <div>
                <h3>Quick actions</h3>
                <p>Start a new BIM workspace or join a session.</p>
              </div>
            </div>
            <div className="dashboard-quick-actions">
              <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
                <Icon name="plus" /> New project
              </button>
              {lastProjectId && (
                <button
                  className="btn btn-secondary"
                  onClick={() => handleOpenProject(lastProjectId)}
                >
                  Resume last
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setProjectSearch("plan")}>
                <Icon name="search" /> Find plans
              </button>
            </div>
          </section>
        </div>

        {/* Projects Section Header */}
        <div className="section-header">
          <div>
            <h2>{copy.dashboard.title}</h2>
            <p className="section-subtitle">
              {copy.dashboard.subtitle}
            </p>
          </div>
          <div className="dashboard-actions">
            {lastProjectId && (
              <button
                className="btn btn-secondary"
                onClick={() => handleOpenProject(lastProjectId)}
              >
                {copy.dashboard.resumeLastSession}
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Icon name="plus" /> {copy.dashboard.newProject}
            </button>
          </div>
        </div>

        <div className="dashboard-toolbar">
          <input
            type="search"
            className="projects-search"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            placeholder={copy.dashboard.searchPlaceholder}
            aria-label={copy.dashboard.searchLabel}
          />
        </div>

        <div className="join-session-card">
          <h3>{copy.dashboard.joinTitle}</h3>
          <p>{copy.dashboard.joinSubtitle}</p>
          <form className="join-session-form" onSubmit={handleJoinSession}>
            <select
              className="join-role-select"
              value={joinRole}
              onChange={(e) => setJoinRole(e.target.value as ProjectRole)}
              aria-label={copy.dashboard.roleLabel}
            >
              {PROJECT_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              placeholder={copy.dashboard.joinPlaceholder}
              maxLength={12}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={joining || !sessionCode.trim()}
            >
              {joining ? copy.dashboard.joining : copy.dashboard.joinSession}
            </button>
          </form>
          {joinError && (
            <div className="error-message">
              <strong>{copy.dashboard.errorPrefix}:</strong> {joinError}
            </div>
          )}
        </div>

        {/* Create Project Form */}
        {showCreateForm && (
          <div className="create-form-card">
            <h3>{copy.dashboard.createTitle}</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label htmlFor="projectName">{copy.dashboard.projectName}</label>
                <input
                  id="projectName"
                  type="text"
                  placeholder={copy.dashboard.projectNamePlaceholder}
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectDesc">{copy.dashboard.projectDesc}</label>
                <textarea
                  id="projectDesc"
                  placeholder={copy.dashboard.projectDescPlaceholder}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  rows={3}
                />
              </div>

              {createError && (
                <div className="error-message">
                  <strong>{copy.dashboard.errorPrefix}:</strong> {createError}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={creating || !newProjectName.trim()}
                  className="btn btn-primary"
                >
                  {creating ? copy.dashboard.creating : copy.dashboard.createProject}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-secondary"
                >
                  {copy.dashboard.cancel}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Projects Grid */}
        {loading ? (
          <div className="loading-state">{copy.dashboard.loadingProjects}</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="folder" />
            </div>
            <h3>{copy.dashboard.noProjects}</h3>
            <p>{copy.dashboard.noProjectsSubtitle}</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              {copy.dashboard.createFirstProject}
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="search" />
            </div>
            <h3>{copy.dashboard.noMatches}</h3>
            <p>{copy.dashboard.noMatchesSubtitle}</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => {
              const documentCount =
                project.documentsCount ?? project.documents?.length ?? 0;
              return (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => handleOpenProject(project.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenProject(project.id);
                    }
                  }}
                >
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <span className="project-status">{project.status}</span>
                  </div>

                  <p className="project-description">
                    {project.description || copy.dashboard.noDescription}
                  </p>

                  <div className="project-meta">
                    <div className="meta-item">
                      <span className="meta-icon">
                        <Icon name="file" />
                      </span>
                      <span>
                        {documentCount}{" "}
                        {documentCount !== 1
                          ? copy.dashboard.documentsMany
                          : copy.dashboard.documentsOne}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">
                        <Icon name="calendar" />
                      </span>
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">
                        <Icon name="users" />
                      </span>
                      <span>
                        {project.memberCount}{" "}
                        {project.memberCount !== 1
                          ? copy.dashboard.collaboratorMany
                          : copy.dashboard.collaboratorOne}
                      </span>
                    </div>
                  </div>

                  <div className="session-code">
                    {copy.dashboard.sessionPrefix}:{" "}
                    {project.sessionCode || copy.dashboard.sessionNotGenerated}
                  </div>
                  <div className="session-role">
                    {copy.dashboard.yourRolePrefix}: {project.currentUserRole}
                  </div>

                  <div className="project-action">
                    <button
                      className="btn btn-sm btn-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project.id);
                      }}
                    >
                      {copy.dashboard.openProject}
                    </button>
                    <select
                      className="project-role-select"
                      value={getInviteRole(project.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setInviteRoleByProject((prev) => ({
                          ...prev,
                          [project.id]: e.target.value as ProjectRole,
                        }))
                      }
                      aria-label={copy.dashboard.inviteRoleLabel}
                    >
                      {PROJECT_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <a
                      className="btn btn-sm btn-secondary"
                      href={buildWhatsappInvite(project.id, project.sessionCode)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {copy.dashboard.whatsappInvite}
                    </a>
                    {isAdmin && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleDeleteProject(project.id);
                        }}
                      >
                        {copy.dashboard.deleteSession}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
