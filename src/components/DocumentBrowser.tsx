import React, { useEffect, useState } from "react";
import { useDocumentsStore } from "../services/state/useDocumentsStore";
import { documentsApi } from "../services/api/documentsApi";
import "../styles/components/document-browser.css";

interface DocumentBrowserProps {
  projectId: string;
  onSelectDocument: (file: File) => void;
}

export default function DocumentBrowser({
  projectId,
  onSelectDocument,
}: DocumentBrowserProps) {
  const {
    documents,
    loading,
    uploading,
    fetch,
    upload,
    selectDocument,
    versions,
  } = useDocumentsStore();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [showVersions, setShowVersions] = useState<string | null>(null);

  useEffect(() => {
    fetch(projectId);
  }, [projectId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    try {
      await upload(projectId, file);
      e.currentTarget.value = "";
    } catch (err) {
      alert("Upload failed");
    }
  };

  const handleDownload = async (docId: string) => {
    try {
      const url = await documentsApi.download(projectId, docId);
      window.open(url, "_blank");
    } catch (error) {
      alert("Download failed");
    }
  };

  return (
    <div className="document-browser">
      <div className="browser-header">
        <h3>Documents</h3>
        <label className="upload-btn">
          {uploading ? "Uploading..." : "+ Upload"}
          <input
            type="file"
            accept=".ifc"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {loading ? (
        <p className="loading">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="empty">No documents uploaded yet</p>
      ) : (
        <div className="documents-list">
          {documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <div className="doc-header">
                <div
                  className={`doc-name ${selectedDocId === doc.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    selectDocument(doc, projectId);
                  }}
                >
                  <span className="icon">📄</span>
                  {doc.name}
                </div>
                <div className="doc-actions">
                  <button
                    className="icon-btn"
                    onClick={() =>
                      setShowVersions(showVersions === doc.id ? null : doc.id)
                    }
                    title="View versions"
                  >
                    ⏱️
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleDownload(doc.id)}
                    title="Download"
                  >
                    ⬇️
                  </button>
                </div>
              </div>

              {showVersions === doc.id && versions.length > 0 && (
                <div className="versions-list">
                  {versions.map((v, i) => (
                    <div
                      key={v.id}
                      className={`version-item ${v.isActive ? "active" : ""}`}
                    >
                      <span>v{v.versionNumber}</span>
                      <span className="date">
                        {new Date(v.createdAt).toLocaleDateString()}
                      </span>
                      {!v.isActive && (
                        <button
                          className="activate-btn"
                          onClick={() => {
                            // Activate version
                          }}
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="doc-meta">
                <small>{(doc.fileSize / 1024 / 1024).toFixed(2)}MB</small>
                <small>{doc.status}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
