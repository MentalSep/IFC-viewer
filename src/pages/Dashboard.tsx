import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { useAuthStore } from "../services/state/useAuthStore";
import { useProjectsStore } from "../services/state/useProjectsStore";
import "../styles/pages/dashboard.css";

const LAST_PROJECT_KEY = "ifc_last_project_id";

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    const trimmedName = newProjectName.trim();
    const trimmedDesc = newProjectDesc.trim();
    if (!trimmedName) {
      setCreateError("Project name is required");
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
      setJoinError("Session code is required");
      return;
    }

    setJoining(true);
    try {
      const joinedProject = await joinBySessionCode(normalizedCode);
      setSessionCode("");
      handleOpenProject(joinedProject.id);
    } catch (err: any) {
      setJoinError(err?.message || "Unable to join session");
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
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>CoBIM Cloud</h1>
          <p>Enterprise BIM Collaboration</p>
        </div>
        <div className="dashboard-header-right">
          <span className="user-info">Welcome, {user?.name}</span>
          <button className="btn btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Projects Section Header */}
        <div className="section-header">
          <div>
            <h2>Your Projects</h2>
            <p className="section-subtitle">
              Manage and open your BIM projects
            </p>
          </div>
          <div className="dashboard-actions">
            {lastProjectId && (
              <button
                className="btn btn-secondary"
                onClick={() => handleOpenProject(lastProjectId)}
              >
                Resume Last Session
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Icon name="plus" /> New Project
            </button>
          </div>
        </div>

        <div className="dashboard-toolbar">
          <input
            type="search"
            className="projects-search"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            placeholder="Search projects by name or description..."
            aria-label="Search projects"
          />
        </div>

        <div className="join-session-card">
          <h3>Join Collaboration Session</h3>
          <p>Enter a project session code to join a shared group workspace.</p>
          <form className="join-session-form" onSubmit={handleJoinSession}>
            <input
              type="text"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              placeholder="e.g. K3P8N6Q2"
              maxLength={12}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={joining || !sessionCode.trim()}
            >
              {joining ? "Joining..." : "Join Session"}
            </button>
          </form>
          {joinError && (
            <div className="error-message">
              <strong>Error:</strong> {joinError}
            </div>
          )}
        </div>

        {/* Create Project Form */}
        {showCreateForm && (
          <div className="create-form-card">
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="e.g., Downtown Office Building"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectDesc">Description (optional)</label>
                <textarea
                  id="projectDesc"
                  placeholder="Project details, location, etc."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  rows={3}
                />
              </div>

              {createError && (
                <div className="error-message">
                  <strong>Error:</strong> {createError}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={creating || !newProjectName.trim()}
                  className="btn btn-primary"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Projects Grid */}
        {loading ? (
          <div className="loading-state">Loading your projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="folder" />
            </div>
            <h3>No projects yet</h3>
            <p>Create your first project to get started with CoBIM Cloud</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              Create First Project
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="search" />
            </div>
            <h3>No matching projects</h3>
            <p>Try a different search term.</p>
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
                    {project.description || "No description"}
                  </p>

                  <div className="project-meta">
                    <div className="meta-item">
                      <span className="meta-icon">
                        <Icon name="file" />
                      </span>
                      <span>
                        {documentCount} document
                        {documentCount !== 1 ? "s" : ""}
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
                      <span>{project.memberCount} collaborator{project.memberCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  <div className="session-code">
                    Session: {project.sessionCode || "Not generated yet"}
                  </div>

                  <div className="project-action">
                    <button
                      className="btn btn-sm btn-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project.id);
                      }}
                    >
                      Open Project
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
