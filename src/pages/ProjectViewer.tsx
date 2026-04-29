import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectsStore } from "../services/state/useProjectsStore";
import { useDocumentsStore } from "../services/state/useDocumentsStore";
import { useAuthStore } from "../services/state/useAuthStore";
import IFCViewer from "../components/IFCViewer";
import DocumentBrowser from "../components/DocumentBrowser";
import "../styles/pages/project-viewer.css";

export function ProjectViewer() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentProject, loadProject } = useProjectsStore();
  const { selectedDocument, fetch: fetchDocuments } = useDocumentsStore();
  const { user } = useAuthStore();
  const [activeFile, setActiveFile] = useState<File | null>(null);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
      fetchDocuments(projectId);
    }
  }, [projectId]);

  const handleDocumentSelect = (file: File) => {
    setActiveFile(file);
  };

  return (
    <div className="project-viewer">
      <div className="viewer-header">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-secondary"
        >
          ← Dashboard
        </button>
        <h1>{currentProject?.name || "Loading..."}</h1>
        <span className="user-badge">{user?.name}</span>
      </div>

      <div className="viewer-layout">
        <aside className="sidebar">
          <DocumentBrowser
            projectId={projectId!}
            onSelectDocument={handleDocumentSelect}
          />
        </aside>

        <main className="viewer-main">
          {activeFile ? (
            <IFCViewer file={activeFile} />
          ) : selectedDocument ? (
            <IFCViewer file={null} />
          ) : (
            <div className="empty-viewer">
              <p>Select a document from the sidebar to view</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
