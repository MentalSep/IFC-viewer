import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../services/state/useAuthStore";
import { useProjectsStore } from "../services/state/useProjectsStore";
import "../styles/pages/dashboard.css";

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { projects, loading, error, fetch, create } = useProjectsStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setCreating(true);
    try {
      const newProject = await create(newProjectName, newProjectDesc);
      setNewProjectName("");
      setNewProjectDesc("");
      setShowCreateForm(false);
      navigate(`/projects/${newProject.id}`);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="dashboard" data-theme="dark">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>🏗️ CoBIM Cloud</h1>
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
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            ➕ New Project
          </button>
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
            <div className="empty-icon">📦</div>
            <h3>No projects yet</h3>
            <p>Create your first project to get started with CoBIM Cloud</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              ➕ Create First Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => handleOpenProject(project.id)}
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
                    <span className="meta-icon">📄</span>
                    <span>
                      {project.documents?.length || 0} document
                      {(project.documents?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="project-action">
                  <button className="btn btn-sm btn-accent">
                    Open Project →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
