import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../services/state/useAuthStore";
import IFCViewer, { type IFCViewerRef } from "../components/IFCViewer";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Toolbar";
import PropertiesPanel from "../components/PropertiesPanel";
import Chat from "../components/Chat";
import type { ChatMessage } from "../components/Chat";
import KeyboardShortcuts from "../components/KeyboardShortcuts";
import ViewCube from "../components/ViewCube";
import ElementComments, {
  type ElementComment,
  type ElementCommentDraft,
  type ProfessionalRole,
} from "../components/ElementComments";
import DocumentBrowser from "../components/DocumentBrowser";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firebaseDb } from "../services/firebase/client";

import type { ElementTypeInfo } from "../components/ModelTree";
import type { SelectedElementData } from "../components/PropertiesPanel";
import "../styles/global.css";
import "../styles/pages/project-viewer.css";

const LAST_PROJECT_KEY = "ifc_last_project_id";
const PROJECT_SESSION_PREFIX = "ifc_project_session_";

type RightPanelTab = "properties" | "comments" | "documents";

interface ProjectSessionState {
  theme: "dark" | "light";
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  rightPanelTab: RightPanelTab;
  searchQuery: string;
  userRole: ProfessionalRole;
}

export function ProjectViewer() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const ifcViewerRef = useRef<IFCViewerRef>(null);

  const [loadedFile, setLoadedFile] = useState<File | null>(null);
  const [loadedInfo, setLoadedInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const [status, setStatus] = useState("Ready to load IFC file");
  const [loadTimeMs, setLoadTimeMs] = useState<number | null>(null);
  const [elementTypes, setElementTypes] = useState<ElementTypeInfo[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<SelectedElementData | null>(null);

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>("properties");
  const [comments, setComments] = useState<ElementComment[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userRole, setUserRole] = useState<ProfessionalRole>("Architect");
  const loadStatusTimerRef = useRef<number | null>(null);

  // Blank canvas - user uploads file

  const handleFileSelected = (file: File) => {
    if (loadStatusTimerRef.current !== null) {
      clearTimeout(loadStatusTimerRef.current);
    }

    const startTime = performance.now();
    setLoadedFile(file);
    setLoadedInfo({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
    });
    setStatus("Loading...");
    setSelectedElement(null);

    loadStatusTimerRef.current = window.setTimeout(() => {
      const endTime = performance.now();
      setLoadTimeMs(endTime - startTime);
      setStatus("Model loaded successfully");
    }, 1000);
  };

  const handleViewerLoad = useCallback(() => {
    setStatus("Model loaded successfully");
  }, []);

  const handleViewerError = useCallback((err: string) => {
    setStatus(`Error: ${err}`);
  }, []);

  const handleElementTypesReady = useCallback((types: ElementTypeInfo[]) => {
    setElementTypes(types);
  }, []);

  const handleElementSelected = useCallback(
    (data: SelectedElementData | null) => {
      setSelectedElement(data);
    },
    [],
  );

  // Call viewer methods directly - NO state updates needed here!
  // This prevents re-renders that would reset the viewer
  const handleFitCamera = useCallback(
    () => ifcViewerRef.current?.fitCamera(),
    [],
  );
  const handleResetCamera = useCallback(
    () => ifcViewerRef.current?.resetCamera(),
    [],
  );
  const handleToggleWireframe = useCallback(
    () => ifcViewerRef.current?.toggleWireframe(),
    [],
  );
  const handleToggleGrid = useCallback(
    () => ifcViewerRef.current?.toggleGrid(),
    [],
  );
  const handleToggleTransparency = useCallback(
    () => ifcViewerRef.current?.toggleTransparency(),
    [],
  );
  const handleScreenshot = useCallback(
    () => ifcViewerRef.current?.screenshot(),
    [],
  );
  const handleZoomIn = useCallback(() => ifcViewerRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => ifcViewerRef.current?.zoomOut(), []);
  const handleToggleMeasure = useCallback(
    () => ifcViewerRef.current?.toggleMeasure(),
    [],
  );
  const handleClearMeasurements = useCallback(
    () => ifcViewerRef.current?.clearMeasurements(),
    [],
  );
  const handleToggleClipping = useCallback(
    () => ifcViewerRef.current?.toggleClipping(),
    [],
  );
  const handleClipHeightChange = useCallback((ratio: number) => {
    ifcViewerRef.current?.setClipHeight(ratio);
  }, []);
  const handleToggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      return newTheme;
    });
  }, []);

  const handleElementTypeClick = useCallback((type: string) => {
    // Filter or highlight elements of this type
  }, []);

  // Ensure viewer resizes when sidebars open/close
  useEffect(() => {
    // Wait for layout to settle, then trigger multiple RAF frames to catch resize
    const timerId = setTimeout(() => {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          ifcViewerRef.current?.resize();
        });
      });
    }, 150);
    return () => clearTimeout(timerId);
  }, [showLeftSidebar, showRightSidebar]);

  useEffect(() => {
    return () => {
      if (loadStatusTimerRef.current !== null) {
        clearTimeout(loadStatusTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!projectId) return;
    localStorage.setItem(LAST_PROJECT_KEY, projectId);

    const stored = localStorage.getItem(`${PROJECT_SESSION_PREFIX}${projectId}`);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as Partial<ProjectSessionState>;
      if (parsed.theme === "dark" || parsed.theme === "light") {
        setTheme(parsed.theme);
        document.documentElement.setAttribute("data-theme", parsed.theme);
      }
      if (typeof parsed.showLeftSidebar === "boolean") {
        setShowLeftSidebar(parsed.showLeftSidebar);
      }
      if (typeof parsed.showRightSidebar === "boolean") {
        setShowRightSidebar(parsed.showRightSidebar);
      }
      if (
        parsed.rightPanelTab === "properties" ||
        parsed.rightPanelTab === "comments" ||
        parsed.rightPanelTab === "documents"
      ) {
        setRightPanelTab(parsed.rightPanelTab);
      }
      if (typeof parsed.searchQuery === "string") {
        setSearchQuery(parsed.searchQuery);
      }
      if (parsed.userRole) {
        setUserRole(parsed.userRole);
      }
    } catch {
      localStorage.removeItem(`${PROJECT_SESSION_PREFIX}${projectId}`);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    const sessionState: ProjectSessionState = {
      theme,
      showLeftSidebar,
      showRightSidebar,
      rightPanelTab,
      searchQuery,
      userRole,
    };
    localStorage.setItem(
      `${PROJECT_SESSION_PREFIX}${projectId}`,
      JSON.stringify(sessionState),
    );
  }, [
    projectId,
    theme,
    showLeftSidebar,
    showRightSidebar,
    rightPanelTab,
    searchQuery,
    userRole,
  ]);

  useEffect(() => {
    if (!projectId) return;

    const messagesQuery = query(
      collection(firebaseDb, "projects", projectId, "chatMessages"),
      orderBy("timestamp", "asc"),
    );
    const commentsQuery = query(
      collection(firebaseDb, "projects", projectId, "comments"),
      orderBy("timestamp", "asc"),
    );

    const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
      const nextMessages: ChatMessage[] = snapshot.docs.map((item) => {
        const data = item.data();
        const timestamp = data.timestamp;
        const date =
          timestamp instanceof Timestamp
            ? timestamp.toDate()
            : new Date(Date.now());
        return {
          id: item.id,
          author: data.author ?? "Unknown",
          role: (data.role ?? "Architect") as ProfessionalRole,
          text: data.text ?? "",
          timestamp: date,
        };
      });
      setChatMessages(nextMessages);
    });

    const unsubComments = onSnapshot(commentsQuery, (snapshot) => {
      const nextComments: ElementComment[] = snapshot.docs.map((item) => {
        const data = item.data();
        const timestamp = data.timestamp;
        const date =
          timestamp instanceof Timestamp
            ? timestamp.toDate()
            : new Date(Date.now());
        return {
          id: item.id,
          expressId: data.expressId ?? 0,
          elementType: data.elementType ?? "Unknown",
          author: data.author ?? "Unknown",
          role: (data.role ?? "Architect") as ProfessionalRole,
          text: data.text ?? "",
          timestamp: date,
          priority: data.priority ?? "info",
        };
      });
      setComments(nextComments);
    });

    return () => {
      unsubMessages();
      unsubComments();
    };
  }, [projectId]);

  const handleSendChatMessage = useCallback(
    async (text: string, author: string, role: ProfessionalRole) => {
      if (!projectId) return;
      await addDoc(collection(firebaseDb, "projects", projectId, "chatMessages"), {
        text,
        author,
        role,
        timestamp: serverTimestamp(),
      });
    },
    [projectId],
  );

  const handleAddComment = useCallback(
    async (comment: ElementCommentDraft) => {
      if (!projectId) return;
      await addDoc(collection(firebaseDb, "projects", projectId, "comments"), {
        ...comment,
        timestamp: serverTimestamp(),
      });
    },
    [projectId],
  );

  return (
    <div className="app-container" data-theme={theme}>
      {/* Header */}
      <div className="project-topbar">
        <div className="project-topbar-left">
          <button
            onClick={() => navigate("/dashboard")}
            className="project-topbar-link"
          >
            ← Dashboard
          </button>
          <h1 className="project-topbar-title">
            Project {projectId?.slice(0, 8)}...
          </h1>
          <span className="project-topbar-user">
            {user?.name}
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="project-topbar-btn"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Main Layout */}
      <div className="project-layout">
        {/* Left Sidebar */}
        {showLeftSidebar && (
          <div className="project-left-sidebar">
            <div className="project-sidebar-controls">
              <button
                onClick={() => setShowLeftSidebar(false)}
                className="project-sidebar-toggle-btn"
                title="Collapse sidebar"
              >
                ‹
              </button>
            </div>
            <Sidebar
              onFileSelected={handleFileSelected}
              status={status}
              loadedInfo={loadedInfo}
              onFitCamera={handleFitCamera}
              onResetCamera={handleResetCamera}
              elementTypes={elementTypes}
              onElementTypeClick={handleElementTypeClick}
              loadTimeMs={loadTimeMs}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        )}

        {/* Main Viewer */}
        <div className="project-main">
          {/* Toggle Left Sidebar Button */}
          {!showLeftSidebar && (
            <button
              onClick={() => setShowLeftSidebar(true)}
              className="project-open-left-btn"
              title="Open sidebar"
            >
              ☰
            </button>
          )}
          {/* Toolbar */}
          <div className="project-toolbar-row">
            <Toolbar
              onToggleWireframe={handleToggleWireframe}
              onToggleGrid={handleToggleGrid}
              onToggleTransparency={handleToggleTransparency}
              onScreenshot={handleScreenshot}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onToggleMeasure={handleToggleMeasure}
              onClearMeasurements={handleClearMeasurements}
              onToggleClipping={handleToggleClipping}
              onClipHeightChange={handleClipHeightChange}
              onShowShortcuts={() => setShowShortcuts(true)}
            />
          </div>

          {/* Viewer + Right Panels */}
          <div className="project-viewer-row">
            {/* 3D Viewer */}
            <div className="project-viewer-canvas">
              <IFCViewer
                ref={ifcViewerRef}
                file={loadedFile}
                onLoad={handleViewerLoad}
                onError={handleViewerError}
                onElementTypesReady={handleElementTypesReady}
                onElementSelected={handleElementSelected}
                theme={theme}
              />
              <ViewCube
                onSetView={(direction) =>
                  ifcViewerRef.current?.setViewAngle(direction)
                }
              />

              {/* Toggle Right Sidebar Button */}
              {!showRightSidebar && (
                <button
                  onClick={() => setShowRightSidebar(true)}
                  className="project-open-right-btn"
                  title="Open properties panel"
                >
                  ☰
                </button>
              )}
            </div>

            {/* Right Panels */}
            {showRightSidebar && (
              <div className="project-right-sidebar">
                <div className="project-right-sidebar-header">
                  <div className="project-right-tab-row">
                    <button
                      className={`tab-btn ${rightPanelTab === "properties" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("properties")}
                      title="Properties"
                    >
                      Properties
                    </button>
                    <button
                      className={`tab-btn ${rightPanelTab === "comments" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("comments")}
                      title="Comments"
                    >
                      Comments
                    </button>
                    <button
                      className={`tab-btn ${rightPanelTab === "documents" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("documents")}
                      title="Documents"
                    >
                      Documents
                    </button>
                  </div>
                  <button
                    onClick={() => setShowRightSidebar(false)}
                    className="project-sidebar-toggle-btn"
                    title="Collapse panel"
                  >
                    ›
                  </button>
                </div>

                <div className="project-right-content">
                  {rightPanelTab === "properties" ? (
                    selectedElement ? (
                      <PropertiesPanel
                        data={selectedElement}
                        onClose={() => setSelectedElement(null)}
                      />
                    ) : (
                      <div className="project-empty-properties">
                        Select an element to view properties
                      </div>
                    )
                  ) : rightPanelTab === "comments" ? (
                    <ElementComments
                      selectedExpressId={selectedElement?.expressId ?? null}
                      selectedElementType={selectedElement?.type ?? null}
                      comments={comments}
                      onAddComment={handleAddComment}
                      userName={user?.name ?? "Guest"}
                      userRole={userRole}
                    />
                  ) : projectId ? (
                    <DocumentBrowser
                      projectId={projectId}
                      onSelectDocument={handleFileSelected}
                    />
                  ) : (
                    <div className="project-empty-properties">
                      Project is not available.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat */}
      <Chat
        fileName={loadedInfo?.name ?? null}
        messages={chatMessages}
        onSendMessage={handleSendChatMessage}
        initialUserName={user?.name}
        initialRole={userRole}
        onUserReady={(_, role) => setUserRole(role)}
      />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
