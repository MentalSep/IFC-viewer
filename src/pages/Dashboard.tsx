import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { Navbar } from "../components/Navbar";
import { useAppLanguage } from "../components/AppLanguage";
import { useProjectsStore } from "../services/state/useProjectsStore";
import "../styles/pages/dashboard.css";

const LAST_PROJECT_KEY = "ifc_last_project_id";

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { copy } = useAppLanguage();
  const { projects, loading, error, fetch, subscribe, create, joinBySessionCode } =
    useProjectsStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [createError, setCreateError] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [lastProjectId, setLastProjectId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch();
    const unsubscribe = subscribe();
    setLastProjectId(localStorage.getItem(LAST_PROJECT_KEY));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("session");
    if (code) {
      setSessionCode(code.toUpperCase());
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
      const joinedProject = await joinBySessionCode(normalizedCode);
      setSessionCode("");
      handleOpenProject(joinedProject.id);
    } catch (err: any) {
      setJoinError(err?.message || copy.dashboard.joinFailed);
    } finally {
      setJoining(false);
    }
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

  return (
    <div className="dashboard">
      <Navbar variant="dashboard" />

      {/* Main Content */}
      <div className="dashboard-content">
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
