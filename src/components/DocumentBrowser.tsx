import React, { useEffect, useState } from "react";
import { useDocumentsStore } from "../services/state/useDocumentsStore";
import { documentsApi } from "../services/api/documentsApi";
import { Icon } from "./ui/Icon";
import {
  getSupported3DAccept,
  isPreviewable3DFileName,
  isSupported3DFileName,
} from "../utils/modelFormats";
import type { ViewerCopy } from "../utils/viewerI18n";
import "../styles/components/document-browser.css";

interface DocumentBrowserProps {
  projectId: string;
  onSelectDocument: (file: File) => void;
  copy: ViewerCopy["documents"];
}

export default function DocumentBrowser({
  projectId,
  onSelectDocument,
  copy,
}: DocumentBrowserProps) {
  const {
    documents,
    loading,
    uploading,
    subscribe,
    upload,
    selectDocument,
    versions,
    activateVersion,
  } = useDocumentsStore();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [showVersions, setShowVersions] = useState<string | null>(null);
  const [openingDocId, setOpeningDocId] = useState<string | null>(null);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [browserError, setBrowserError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribe(projectId);
    return () => unsubscribe();
  }, [projectId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setBrowserError(null);
    try {
      if (!isSupported3DFileName(file.name)) {
        setBrowserError(copy.previewError);
        return;
      }
      await upload(projectId, file);
    } catch (err) {
      setBrowserError(err instanceof Error ? err.message : copy.uploadError);
    } finally {
      e.currentTarget.value = "";
    }
  };

  const handleDownload = async (docId: string) => {
    setDownloadingDocId(docId);
    setBrowserError(null);
    try {
      const { blob, fileName } = await documentsApi.download(projectId, docId);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 500);
    } catch (error) {
      setBrowserError(error instanceof Error ? error.message : copy.downloadError);
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleOpenInViewer = async (docId: string, fileName: string) => {
    if (!isPreviewable3DFileName(fileName)) {
      setBrowserError(copy.previewError);
      return;
    }

    setOpeningDocId(docId);
    setBrowserError(null);
    try {
      const { blob } = await documentsApi.download(projectId, docId);
      const file = new File([blob], fileName, {
        type: blob.type || "application/octet-stream",
      });
      onSelectDocument(file);
    } catch (error) {
      setBrowserError(error instanceof Error ? error.message : copy.downloadError);
    } finally {
      setOpeningDocId(null);
    }
  };

  return (
    <div className="panel document-browser">
      <div className="browser-header">
        <h3>{copy.title}</h3>
        <label className="upload-btn">
          {uploading ? copy.uploading : `+ ${copy.upload}`}
          <input
            type="file"
            accept={getSupported3DAccept()}
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {loading ? (
        <p className="loading">{copy.loading}</p>
      ) : browserError ? (
        <div className="browser-message error">{browserError}</div>
      ) : documents.length === 0 ? (
        <p className="empty">{copy.empty}</p>
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
                  <span className="icon">
                    <Icon name="file" />
                  </span>
                  {doc.name}
                </div>
                <div className="doc-actions">
                  <button
                    className="icon-btn"
                    onClick={() => {
                      const nextShow = showVersions === doc.id ? null : doc.id;
                      setShowVersions(nextShow);
                      if (nextShow) {
                        void selectDocument(doc, projectId);
                      }
                    }}
                    title={copy.versions}
                  >
                    <Icon name="history" />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleDownload(doc.id)}
                    title={copy.download}
                    disabled={downloadingDocId === doc.id}
                  >
                    {downloadingDocId === doc.id ? "..." : <Icon name="download" />}
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => void handleOpenInViewer(doc.id, doc.name)}
                    title={
                        isPreviewable3DFileName(doc.name)
                          ? copy.openViewer
                          : copy.previewUnavailable
                      }
                     disabled={openingDocId === doc.id || !isPreviewable3DFileName(doc.name)}
                   >
                    {openingDocId === doc.id ? "..." : <Icon name="eye" />}
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
                          onClick={() =>
                            void activateVersion(projectId, doc.id, v.id)
                          }
                        >
                          {copy.activate}
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
