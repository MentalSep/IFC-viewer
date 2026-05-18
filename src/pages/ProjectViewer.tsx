import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../services/state/useAuthStore";
import { Navbar } from "../components/Navbar";
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
import { useAppLanguage } from "../components/AppLanguage";
import { getViewerCopy, type ViewerTheme } from "../utils/viewerI18n";
import "../styles/global.css";
import "../styles/pages/project-viewer.css";

const LAST_PROJECT_KEY = "ifc_last_project_id";
const PROJECT_SESSION_PREFIX = "ifc_project_session_";

type RightPanelTab = "properties" | "comments" | "documents";

interface ProjectSessionState {
  theme: ViewerTheme;
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  rightPanelTab: RightPanelTab;
  searchQuery: string;
  userRole: ProfessionalRole;
}

export function ProjectViewer() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuthStore();
  const { locale, cycleLocale } = useAppLanguage();
  const ifcViewerRef = useRef<IFCViewerRef>(null);

  const [loadedFile, setLoadedFile] = useState<File | null>(null);
  const [loadedInfo, setLoadedInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const [status, setStatus] = useState("");
  const [loadTimeMs, setLoadTimeMs] = useState<number | null>(null);
  const [elementTypes, setElementTypes] = useState<ElementTypeInfo[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<SelectedElementData | null>(null);

  const [theme, setTheme] = useState<ViewerTheme>("dark");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>("properties");
  const [comments, setComments] = useState<ElementComment[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userRole, setUserRole] = useState<ProfessionalRole>("Architect");
  const loadStatusTimerRef = useRef<number | null>(null);
  const copy = useMemo(() => getViewerCopy(locale), [locale]);

  // Blank canvas - user uploads file

  const handleFileSelected = useCallback((file: File) => {
    if (loadStatusTimerRef.current !== null) {
      clearTimeout(loadStatusTimerRef.current);
    }

    const startTime = performance.now();
    setLoadedFile(file);
    setLoadedInfo({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
    });
    setStatus(copy.shell.statusLoading);
    setSelectedElement(null);

    loadStatusTimerRef.current = window.setTimeout(() => {
      const endTime = performance.now();
      setLoadTimeMs(endTime - startTime);
      setStatus(copy.shell.statusLoaded);
    }, 1000);
  }, [copy.shell.statusLoading, copy.shell.statusLoaded]);

  const handleViewerLoad = useCallback(() => {
    setStatus(copy.shell.statusLoaded);
  }, [copy.shell.statusLoaded]);

  const handleViewerError = useCallback((err: string) => {
    setStatus(`${copy.shell.errorPrefix}: ${err}`);
  }, [copy.shell.errorPrefix]);

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
      const newTheme =
        prevTheme === "dark" ? "light" : prevTheme === "light" ? "aurora" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      return newTheme;
    });
  }, []);

  const handleToggleLocale = useCallback(() => {
    cycleLocale();
  }, [cycleLocale]);

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
      if (
        parsed.theme === "dark" ||
        parsed.theme === "light" ||
        parsed.theme === "aurora"
      ) {
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
    <div className="project-viewer-page" data-theme={theme} data-locale={locale}>
      <Navbar
        variant="project"
        projectTitle={`Project ${projectId?.slice(0, 8)}...`}
      />

      <section className="project-shell-header">
        <div className="project-shell-copy">
          <p className="project-shell-kicker">{copy.shell.title}</p>
          <h1>{copy.shell.subtitle}</h1>
        </div>
        <div className="project-shell-actions">
          <button
            type="button"
            className="project-shell-chip"
            onClick={handleToggleLocale}
          >
            {copy.localeLabel}: {copy.localeNames[locale]}
          </button>
          <button
            type="button"
            className="project-shell-chip"
                onClick={handleToggleTheme}
              >
                {copy.themeLabel}: {copy.themeNames[theme]}
              </button>
              <span className="project-shell-status">
                {status || copy.shell.statusReady}
              </span>
            </div>
          </section>

      {/* Main Layout */}
      <div className="project-layout">
        {/* Left Sidebar */}
        {showLeftSidebar && (
          <div className="project-left-sidebar">
            <div className="project-sidebar-controls">
              <button
                onClick={() => setShowLeftSidebar(false)}
                className="project-sidebar-toggle-btn"
                title={copy.layout.collapseSidebar}
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
              copy={copy.sidebar}
              themeLabel={copy.themeLabel}
              themeName={copy.themeNames[theme]}
              onLocaleChange={handleToggleLocale}
              localeLabel={copy.localeLabel}
              localeName={copy.localeNames[locale]}
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
                title={copy.layout.openSidebar}
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
              copy={copy.toolbar}
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
                    title={copy.layout.openPanel}
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
                      title={copy.layout.tabProperties}
                    >
                      {copy.layout.tabProperties}
                    </button>
                    <button
                      className={`tab-btn ${rightPanelTab === "comments" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("comments")}
                      title={copy.layout.tabComments}
                    >
                      {copy.layout.tabComments}
                    </button>
                    <button
                      className={`tab-btn ${rightPanelTab === "documents" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("documents")}
                      title={copy.layout.tabDocuments}
                    >
                      {copy.layout.tabDocuments}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowRightSidebar(false)}
                    className="project-sidebar-toggle-btn"
                    title={copy.layout.collapsePanel}
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
                        {copy.layout.selectElement}
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
                        copy={copy.documents}
                      />
                    ) : (
                      <div className="project-empty-properties">
                        {copy.layout.projectUnavailable}
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
