import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../services/state/useAuthStore";
import { Navbar } from "../components/Navbar";
import { AppFooter } from "../components/AppFooter";
import IFCViewer, { type IFCViewerRef } from "../components/IFCViewer";
import Sidebar from "../components/Sidebar";
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
import Planning4DPanel, {
  PLAY_DIRECTIONS,
  type PlanningTask,
} from "../components/Planning4DPanel";
import Cost5DPanel from "../components/Cost5DPanel";
import { FloatingToolPalette } from "../components/workspace/FloatingToolPalette";
import { MiniMapNavigator } from "../components/workspace/MiniMapNavigator";
import { WorkspacePresence } from "../components/workspace/WorkspacePresence";
import { WorkspaceActivityFeed, type WorkspaceActivityItem } from "../components/workspace/WorkspaceActivityFeed";
import { WorkspaceTimeline } from "../components/workspace/WorkspaceTimeline";
import { BimSearchPanel, type BimSearchResult } from "../components/workspace/BimSearchPanel";
import { HeatmapLegend, type HeatmapMode } from "../components/workspace/HeatmapLegend";
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
import { getViewerCopy, VIEWER_THEMES, type ViewerTheme } from "../utils/viewerI18n";
import "../styles/global.css";
import "../styles/pages/project-viewer.css";

const LAST_PROJECT_KEY = "ifc_last_project_id";
const PROJECT_SESSION_PREFIX = "ifc_project_session_";

type RightPanelTab =
  | "properties"
  | "comments"
  | "documents"
  | "planning"
  | "costing"
  | "search"
  | "feed"
  | "timeline"
  | "heatmap";

interface ProjectSessionState {
  theme: ViewerTheme;
  workspaceMode: WorkspaceMode;
  heatmapMode: HeatmapMode;
  leftDockWidth: number;
  rightDockWidth: number;
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  rightPanelTab: RightPanelTab;
  searchQuery: string;
  userRole: ProfessionalRole;
}

type WorkspaceMode = "single" | "split" | "compare" | "multi";

export function ProjectViewer() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuthStore();
  const { locale, cycleLocale, copy: appCopy } = useAppLanguage();
  const ifcViewerRef = useRef<IFCViewerRef>(null);

  // Define dynamic workspace data using translated strings
  const WORKSPACE_FLOORS = [
    { id: "ground", label: appCopy.workspace.floorGroundFloor, elevation: "0.00 m" },
    { id: "level-1", label: appCopy.workspace.floorLevel1, elevation: "4.20 m" },
    { id: "level-2", label: appCopy.workspace.floorLevel2, elevation: "8.40 m" },
    { id: "roof", label: appCopy.workspace.floorRoof, elevation: "12.60 m" },
  ];

  const TIMELINE_PHASES: PlanningTask[] = [
    {
      id: "mobilization",
      name: appCopy.workspace.phaseMobilization,
      start: null,
      end: null,
      predecessors: [],
      source: "Generic XML",
    },
    {
      id: "structure",
      name: appCopy.workspace.phaseStructure,
      start: null,
      end: null,
      predecessors: ["mobilization"],
      source: "Generic XML",
    },
    {
      id: "envelope",
      name: appCopy.workspace.phaseEnvelope,
      start: null,
      end: null,
      predecessors: ["structure"],
      source: "Generic XML",
    },
    {
      id: "mep",
      name: appCopy.workspace.phaseMep,
      start: null,
      end: null,
      predecessors: ["envelope"],
      source: "Generic XML",
    },
    {
      id: "closeout",
      name: appCopy.workspace.phaseCloseout,
      start: null,
      end: null,
      predecessors: ["mep"],
      source: "Generic XML",
    },
  ];

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
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("single");
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>("none");
  const [toolPaletteCollapsed, setToolPaletteCollapsed] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [timelinePlaying, setTimelinePlaying] = useState(false);
  const [timelineSpeed, setTimelineSpeed] = useState(1);
  const [activeFloor, setActiveFloor] = useState("ground");
  const [leftDockWidth, setLeftDockWidth] = useState(330);
  const [rightDockWidth, setRightDockWidth] = useState(340);
  const [wireframeActive, setWireframeActive] = useState(false);
  const [gridActive, setGridActive] = useState(true);
  const [xrayActive, setXrayActive] = useState(false);
  const [measureActive, setMeasureActive] = useState(false);
  const [clippingActive, setClippingActive] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>("properties");
  const [isolatedType, setIsolatedType] = useState<string | null>(null);
  const [comments, setComments] = useState<ElementComment[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userRole, setUserRole] = useState<ProfessionalRole>("Architect");
  const loadStatusTimerRef = useRef<number | null>(null);
  const viewerCanvasHostRef = useRef<HTMLDivElement | null>(null);
  const copy = useMemo(() => getViewerCopy(locale), [locale]);
  const workspaceCopy = copy.workspace;

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
  const handleFocusSelected = useCallback(() => {
    ifcViewerRef.current?.focusSelected();
  }, []);
  const handleHideSelected = useCallback(() => {
    ifcViewerRef.current?.hideSelected();
    setSelectedElement(null);
  }, []);
  const handleShowAllElements = useCallback(() => {
    ifcViewerRef.current?.showAllElements();
    setIsolatedType(null);
  }, []);
  const handleClearModel = useCallback(() => {
    ifcViewerRef.current?.clearModel();
    setLoadedFile(null);
    setLoadedInfo(null);
    setElementTypes([]);
    setSelectedElement(null);
    setLoadTimeMs(null);
    setStatus(copy.shell.statusReady);
    setIsolatedType(null);
  }, [copy.shell.statusReady]);
  const handleToggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const currentIndex = VIEWER_THEMES.indexOf(prevTheme);
      const newTheme = VIEWER_THEMES[(currentIndex + 1) % VIEWER_THEMES.length];
      document.documentElement.setAttribute("data-theme", newTheme);
      return newTheme;
    });
  }, []);

  const handleToggleLocale = useCallback(() => {
    cycleLocale();
  }, [cycleLocale]);

  const handleElementTypeClick = useCallback((type: string) => {
    if (isolatedType === type) {
      ifcViewerRef.current?.clearTypeIsolation();
      setIsolatedType(null);
      setStatus(copy.shell.statusLoaded);
      return;
    }
    const visibleCount = ifcViewerRef.current?.isolateElementType(type) ?? 0;
    setIsolatedType(type);
    setStatus(`${type} (${visibleCount})`);
  }, [copy.shell.statusLoaded, isolatedType]);

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
      if (typeof parsed.theme === "string" && VIEWER_THEMES.includes(parsed.theme as ViewerTheme)) {
        const restoredTheme = parsed.theme as ViewerTheme;
        setTheme(restoredTheme);
        document.documentElement.setAttribute("data-theme", restoredTheme);
      }
      if (typeof parsed.showLeftSidebar === "boolean") {
        setShowLeftSidebar(parsed.showLeftSidebar);
      }
      if (typeof parsed.showRightSidebar === "boolean") {
        setShowRightSidebar(parsed.showRightSidebar);
      }
      if (
        parsed.workspaceMode === "single" ||
        parsed.workspaceMode === "split" ||
        parsed.workspaceMode === "compare" ||
        parsed.workspaceMode === "multi"
      ) {
        setWorkspaceMode(parsed.workspaceMode);
      }
      if (
        parsed.heatmapMode === "none" ||
        parsed.heatmapMode === "cost" ||
        parsed.heatmapMode === "progress" ||
        parsed.heatmapMode === "status" ||
        parsed.heatmapMode === "planning"
      ) {
        setHeatmapMode(parsed.heatmapMode);
      }
      if (typeof parsed.leftDockWidth === "number") {
        setLeftDockWidth(parsed.leftDockWidth);
      }
      if (typeof parsed.rightDockWidth === "number") {
        setRightDockWidth(parsed.rightDockWidth);
      }
      if (
        parsed.rightPanelTab === "properties" ||
        parsed.rightPanelTab === "comments" ||
        parsed.rightPanelTab === "documents" ||
        parsed.rightPanelTab === "planning" ||
        parsed.rightPanelTab === "costing" ||
        parsed.rightPanelTab === "search" ||
        parsed.rightPanelTab === "feed" ||
        parsed.rightPanelTab === "timeline" ||
        parsed.rightPanelTab === "heatmap"
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
      workspaceMode,
      heatmapMode,
      leftDockWidth,
      rightDockWidth,
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
    workspaceMode,
    heatmapMode,
    leftDockWidth,
    rightDockWidth,
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

  const handlePlanningStep = useCallback(
    (task: PlanningTask, index: number) => {
      const direction = PLAY_DIRECTIONS[index % PLAY_DIRECTIONS.length];
      ifcViewerRef.current?.setViewAngle(direction);
      setStatus(`${copy.shell.statusLoaded} • ${task.name}`);
    },
    [copy.shell.statusLoaded],
  );

  const handleSetElementProgress = useCallback((expressId: number, progress: number) => {
    return ifcViewerRef.current?.setElementProgress(expressId, progress) ?? false;
  }, []);
  const handleGetQuantitySummary = useCallback(
    () => ifcViewerRef.current?.getQuantitySummary() ?? [],
    [],
  );
  const handleGetElementQuantity = useCallback(
    (expressId: number) => ifcViewerRef.current?.getElementQuantity(expressId) ?? null,
    [],
  );

  const startDockResize = useCallback((side: "left" | "right") => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const startX = event.clientX;
      const startLeft = leftDockWidth;
      const startRight = rightDockWidth;

      const handleMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        if (side === "left") {
          setLeftDockWidth(Math.max(260, Math.min(420, startLeft + delta)));
        } else {
          setRightDockWidth(Math.max(300, Math.min(500, startRight - delta)));
        }
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        document.body.style.cursor = "";
      };

      document.body.style.cursor = "col-resize";
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    };
  }, [leftDockWidth, rightDockWidth]);

  const handleFloorChange = useCallback((floorId: string) => {
    setActiveFloor(floorId);
    switch (floorId) {
      case "ground":
        ifcViewerRef.current?.setViewAngle("iso");
        break;
      case "level-1":
        ifcViewerRef.current?.setViewAngle("front");
        break;
      case "level-2":
        ifcViewerRef.current?.setViewAngle("right");
        break;
      case "roof":
        ifcViewerRef.current?.setViewAngle("top");
        break;
      default:
        ifcViewerRef.current?.setViewAngle("iso");
        break;
    }
  }, []);

  const toggleWireframe = useCallback(() => {
    setWireframeActive((value) => !value);
    handleToggleWireframe();
  }, [handleToggleWireframe]);

  const toggleGrid = useCallback(() => {
    setGridActive((value) => !value);
    handleToggleGrid();
  }, [handleToggleGrid]);

  const toggleXray = useCallback(() => {
    setXrayActive((value) => !value);
    handleToggleTransparency();
  }, [handleToggleTransparency]);

  const toggleMeasure = useCallback(() => {
    setMeasureActive((value) => !value);
    handleToggleMeasure();
  }, [handleToggleMeasure]);

  const toggleClipping = useCallback(() => {
    setClippingActive((value) => !value);
    handleToggleClipping();
  }, [handleToggleClipping]);

  const timelinePhaseIndex = Math.min(
    TIMELINE_PHASES.length - 1,
    Math.max(0, Math.round((timelineProgress / 100) * (TIMELINE_PHASES.length - 1))),
  );

  useEffect(() => {
    if (!timelinePlaying) return;
    const timer = window.setInterval(() => {
      setTimelineProgress((current) => {
        const next = current + timelineSpeed * 4;
        if (next >= 100) return 0;
        return next;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [timelinePlaying, timelineSpeed]);

  useEffect(() => {
    const phase = TIMELINE_PHASES[timelinePhaseIndex];
    if (phase) {
      handlePlanningStep(phase, timelinePhaseIndex);
    }
  }, [handlePlanningStep, timelinePhaseIndex]);

  const activityItems = useMemo<WorkspaceActivityItem[]>(() => {
    const recentComments = comments.slice(-3).map((comment) => ({
      id: `comment-${comment.id}`,
      kind: "comment" as const,
      title: `${comment.author} · ${workspaceCopy.activityKinds.comment} #${comment.expressId}`,
      subtitle: comment.text,
      time: comment.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
    const recentMessages = chatMessages.slice(-2).map((message) => ({
      id: `chat-${message.id}`,
      kind: "action" as const,
      title: `${message.author} · ${workspaceCopy.activityKinds.action}`,
      subtitle: message.text,
      time: message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
    const modelState = loadedInfo
      ? [
          {
            id: "model",
            kind: "upload" as const,
            title: loadedInfo.name,
            subtitle: `${workspaceCopy.activityKinds.upload} · ${loadedInfo.size}`,
            time: status || copy.shell.statusLoaded,
          },
        ]
      : [];
    return [...modelState, ...recentComments, ...recentMessages].slice(0, 6);
  }, [
    chatMessages,
    comments,
    copy.shell.statusLoaded,
    loadedInfo,
    status,
    workspaceCopy.activityKinds.action,
    workspaceCopy.activityKinds.upload,
  ]);

  const searchResults = useMemo<BimSearchResult[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    const chips = new Set<string>();
    return elementTypes
      .filter((item) => {
        const text = `${item.type} ${item.count}`.toLowerCase();
        return !query || text.includes(query);
      })
      .slice(0, 8)
      .map((item) => {
        chips.add(item.type);
        return {
          id: item.type,
          label: item.type,
          category: workspaceCopy.searchCategory,
          count: item.count,
        };
      });
  }, [elementTypes, searchQuery, workspaceCopy.searchCategory]);

  const searchChips = useMemo(() => {
    return elementTypes.slice(0, 6).map((item) => item.type);
  }, [elementTypes]);

  const presenceUsers = useMemo(
    () => [
      {
        id: "me",
        name: user?.name ?? "You",
        role: userRole,
        status: "online" as const,
        color: "#67e8f9",
      },
      { id: "a", name: "Nora Kim", role: "Architect", status: "typing" as const, color: "#a78bfa" },
      { id: "b", name: "Marco Lee", role: "Planner", status: "online" as const, color: "#fcd34d" },
      { id: "c", name: "Sana Patel", role: "Cost Lead", status: "away" as const, color: "#86efac" },
    ],
    [user?.name, userRole],
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
          <h1>{loadedInfo?.name ?? "Enterprise BIM workspace"}</h1>
          <p className="project-shell-subtitle">{copy.shell.subtitle}</p>
        </div>
        <div className="project-shell-actions">
          <button type="button" className="project-shell-chip" onClick={handleToggleLocale}>
            {copy.localeLabel}: {copy.localeNames[locale]}
          </button>
          <button type="button" className="project-shell-chip" onClick={handleToggleTheme}>
            {copy.themeLabel}: {copy.themeNames[theme]}
          </button>
          <div className="project-shell-pill-group">
            {(["single", "split", "compare", "multi"] as WorkspaceMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`project-shell-chip ${workspaceMode === mode ? "active" : ""}`}
                onClick={() => setWorkspaceMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
          <span className="project-shell-status">{status || copy.shell.statusReady}</span>
        </div>
      </section>

      <section className="project-shell-rail">
        <WorkspacePresence users={presenceUsers} />
        <div className="project-shell-metrics">
          <div className="project-shell-metric">
            <span>Model types</span>
            <strong>{elementTypes.length}</strong>
          </div>
          <div className="project-shell-metric">
            <span>Comments</span>
            <strong>{comments.length}</strong>
          </div>
          <div className="project-shell-metric">
            <span>Feed items</span>
            <strong>{activityItems.length}</strong>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="project-layout">
        {/* Left Sidebar */}
        {showLeftSidebar && (
          <div className="project-left-sidebar" style={{ width: leftDockWidth }}>
            <div className="project-sidebar-controls">
              <button
                onClick={() => setShowLeftSidebar(false)}
                className="project-sidebar-toggle-btn"
                title={copy.layout.collapseSidebar}
              >
                ‹
              </button>
              <button
                type="button"
                className="project-sidebar-toggle-btn"
                title="Resize dock"
                onMouseDown={startDockResize("left")}
              >
                ⋮
              </button>
            </div>
            <Sidebar
              onFileSelected={handleFileSelected}
              status={status}
              loadedInfo={loadedInfo}
              onFitCamera={handleFitCamera}
              onResetCamera={handleResetCamera}
              onClearModel={handleClearModel}
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
            <FloatingToolPalette
              collapsed={toolPaletteCollapsed}
              onToggleCollapsed={() => setToolPaletteCollapsed((value) => !value)}
              copy={workspaceCopy}
              groups={[
                {
                  title: workspaceCopy.groupTitles.navigation,
                  actions: [
                    { id: "fit", label: workspaceCopy.minimapFit, icon: "eye", onClick: handleFitCamera },
                    { id: "zoom-in", label: copy.toolbar.zoomIn, icon: "zoomIn", onClick: handleZoomIn },
                    { id: "zoom-out", label: copy.toolbar.zoomOut, icon: "zoomOut", onClick: handleZoomOut },
                  ],
                },
                {
                  title: workspaceCopy.groupTitles.visibility,
                  actions: [
                    { id: "wire", label: copy.toolbar.wire, icon: "wireframe", active: wireframeActive, onClick: toggleWireframe },
                    { id: "grid", label: copy.toolbar.grid, icon: "grid", active: gridActive, onClick: toggleGrid },
                    { id: "xray", label: copy.toolbar.xray, icon: "xray", active: xrayActive, onClick: toggleXray },
                  ],
                },
                {
                  title: workspaceCopy.groupTitles.measurements,
                  actions: [
                    { id: "measure", label: copy.toolbar.measure, icon: "measure", active: measureActive, onClick: toggleMeasure },
                    { id: "clip", label: copy.toolbar.clip, icon: "clip", active: clippingActive, onClick: toggleClipping },
                    { id: "clear", label: copy.toolbar.clear, icon: "trash", onClick: handleClearMeasurements },
                  ],
                },
                {
                  title: workspaceCopy.groupTitles.actions,
                  actions: [
                    { id: "focus", label: copy.toolbar.focus, icon: "eye", onClick: handleFocusSelected },
                    { id: "hide", label: copy.toolbar.hide, icon: "close", onClick: handleHideSelected },
                    { id: "show-all", label: copy.toolbar.showAll, icon: "grid", onClick: handleShowAllElements },
                    { id: "shot", label: copy.toolbar.screenshot, icon: "camera", onClick: handleScreenshot },
                    { id: "keys", label: copy.toolbar.shortcuts, icon: "keyboard", onClick: () => setShowShortcuts(true) },
                  ],
                },
              ]}
            />
          </div>

          {/* Viewer + Right Panels */}
          <div className={`project-viewer-row workspace-mode-${workspaceMode}`}>
            {/* 3D Viewer */}
            <div className="project-viewer-canvas">
              <div ref={viewerCanvasHostRef} className="project-viewer-canvas-host">
                <IFCViewer
                  ref={ifcViewerRef}
                  file={loadedFile}
                  onLoad={handleViewerLoad}
                  onError={handleViewerError}
                  onElementTypesReady={handleElementTypesReady}
                  onElementSelected={handleElementSelected}
                  theme={theme}
                  visualMode={heatmapMode}
                />
                <div className="project-canvas-overlays">
                <MiniMapNavigator
                  floors={WORKSPACE_FLOORS}
                  activeFloor={activeFloor}
                  onFloorChange={handleFloorChange}
                  onFitView={handleFitCamera}
                  copy={workspaceCopy}
                />
                </div>
                <ViewCube
                  onSetView={(direction) =>
                    ifcViewerRef.current?.setViewAngle(direction)
                  }
                />
              </div>

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
              <div className="project-right-sidebar" style={{ width: rightDockWidth }}>
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
                    <button
                      className={`tab-btn ${rightPanelTab === "planning" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("planning")}
                      title={copy.layout.tabPlanning}
                    >
                      {copy.layout.tabPlanning}
                    </button>
                    <button
                      className={`tab-btn ${rightPanelTab === "costing" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("costing")}
                      title={copy.layout.tabCosting}
                    >
                      {copy.layout.tabCosting}
                    </button>
                    <button
                      className={`tab-btn ${rightPanelTab === "search" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("search")}
                      title={workspaceCopy.searchTitle}
                    >
                      {workspaceCopy.searchTitle}
                    </button>
                    <button
                      className={`tab-btn ${rightPanelTab === "heatmap" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("heatmap")}
                      title={workspaceCopy.heatmapTitle}
                    >
                      {workspaceCopy.heatmapTitle}
                    </button>
                    <button
                      className={`tab-btn ${rightPanelTab === "timeline" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("timeline")}
                      title={workspaceCopy.timelineTitle}
                    >
                      {workspaceCopy.timelineTitle}
                    </button>
                    <button
                      className={`tab-btn ${rightPanelTab === "feed" ? "active" : ""}`}
                      onClick={() => setRightPanelTab("feed")}
                      title={workspaceCopy.activityTitle}
                    >
                      {workspaceCopy.activityTitle}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowRightSidebar(false)}
                    className="project-sidebar-toggle-btn"
                    title={copy.layout.collapsePanel}
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    className="project-sidebar-toggle-btn"
                    title="Resize dock"
                    onMouseDown={startDockResize("right")}
                  >
                    ⋮
                  </button>
                </div>

                <div className={`project-right-content workspace-right-${workspaceMode}`}>
                  {workspaceMode !== "single" && (
                    <div className="workspace-aux-panel">
                      {workspaceMode === "split" ? (
                        <WorkspaceActivityFeed items={activityItems} copy={workspaceCopy} />
                      ) : workspaceMode === "compare" ? (
                        <HeatmapLegend mode={heatmapMode} onModeChange={setHeatmapMode} copy={workspaceCopy} />
                      ) : (
                        <WorkspacePresence users={presenceUsers} copy={workspaceCopy} />
                      )}
                    </div>
                  )}
                  <div className="workspace-main-panel">
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
                        selectedExpressId={
                          selectedElement && selectedElement.expressId > 0
                            ? selectedElement.expressId
                            : null
                        }
                        selectedElementType={selectedElement?.type ?? null}
                        comments={comments}
                        onAddComment={handleAddComment}
                        userName={user?.name ?? "Guest"}
                        userRole={userRole}
                      />
                    ) : rightPanelTab === "documents" ? (
                      projectId ? (
                        <DocumentBrowser
                          projectId={projectId}
                          onSelectDocument={handleFileSelected}
                          copy={copy.documents}
                        />
                      ) : (
                        <div className="project-empty-properties">
                          {copy.layout.projectUnavailable}
                        </div>
                      )
                    ) : rightPanelTab === "planning" ? (
                      projectId ? (
                        <Planning4DPanel
                          projectId={projectId}
                          selectedElement={selectedElement}
                          copy={copy.planning}
                          onStepChange={handlePlanningStep}
                          getViewerCanvas={() =>
                            viewerCanvasHostRef.current?.querySelector("canvas") ?? null
                          }
                        />
                      ) : (
                        <div className="project-empty-properties">
                          {copy.layout.projectUnavailable}
                        </div>
                      )
                    ) : rightPanelTab === "costing" ? (
                      projectId ? (
                        <Cost5DPanel
                          projectId={projectId}
                          selectedElement={selectedElement}
                          copy={copy.costing}
                          getQuantitySummary={handleGetQuantitySummary}
                          getElementQuantity={handleGetElementQuantity}
                          setElementProgress={handleSetElementProgress}
                        />
                      ) : (
                        <div className="project-empty-properties">
                          {copy.layout.projectUnavailable}
                        </div>
                      )
                    ) : rightPanelTab === "search" ? (
                      <BimSearchPanel
                        value={searchQuery}
                        onChange={setSearchQuery}
                        results={searchResults}
                        chips={searchChips}
                        onChipClick={setSearchQuery}
                        copy={workspaceCopy}
                        onResultClick={(id) => {
                          handleElementTypeClick(id);
                          setRightPanelTab("properties");
                        }}
                      />
                    ) : rightPanelTab === "heatmap" ? (
                      <HeatmapLegend mode={heatmapMode} onModeChange={setHeatmapMode} copy={workspaceCopy} />
                    ) : rightPanelTab === "timeline" ? (
                      <WorkspaceTimeline
                        phases={TIMELINE_PHASES.map((phase) => ({
                          id: phase.id,
                          label: phase.name,
                          description: phase.source,
                        }))}
                        currentPhaseIndex={timelinePhaseIndex}
                        progress={timelineProgress}
                        speed={timelineSpeed}
                        playing={timelinePlaying}
                        onTogglePlay={() => setTimelinePlaying((value) => !value)}
                        onProgressChange={setTimelineProgress}
                        onSpeedChange={setTimelineSpeed}
                        copy={workspaceCopy}
                      />
                    ) : (
                      <WorkspaceActivityFeed items={activityItems} copy={workspaceCopy} />
                    )}
                  </div>
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
      <AppFooter />
    </div>
  );
}
