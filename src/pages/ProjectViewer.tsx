import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../services/state/useAuthStore";
import { useProjectsStore } from "../services/state/useProjectsStore";
import { Navbar } from "../components/Navbar";
import { AppFooter } from "../components/AppFooter";
import IFCViewer, { type IFCViewerRef } from "../components/IFCViewer";
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
import { QuickStatsOverlay } from "../components/workspace/QuickStatsOverlay";
import { ActiveToolIndicator } from "../components/workspace/ActiveToolIndicator";
import { FPSOverlay } from "../components/workspace/FPSOverlay";
import { Breadcrumbs } from "../components/workspace/Breadcrumbs";
import { WorkspacePresence } from "../components/workspace/WorkspacePresence";
import { WorkspaceActivityFeed, type WorkspaceActivityItem } from "../components/workspace/WorkspaceActivityFeed";
import { WorkspaceTimeline } from "../components/workspace/WorkspaceTimeline";
import { BimSearchPanel, type BimSearchResult } from "../components/workspace/BimSearchPanel";
import { HeatmapLegend, type HeatmapMode } from "../components/workspace/HeatmapLegend";

import { ToolDock } from "../components/ui/ToolDock";
import { HUD } from "../components/ui/HUD";
import { ContextInspector } from "../components/ui/ContextInspector";
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

type UIMode = "VIEW" | "SELECT" | "ANALYSIS" | "SIMULATION";
type ActivePanel = "NONE" | "NAVIGATION" | "CONTEXT";
type ActiveTool = "ORBIT" | "SELECT" | "PAN" | "MEASURE" | "HEATMAP";

interface ProjectSessionState {
  theme: ViewerTheme;
  workspaceMode: WorkspaceMode;
  uiMode: UIMode;
  activePanel: ActivePanel;
  activeTool: ActiveTool;
  hudEnabled: boolean;
  heatmapMode: HeatmapMode;
  searchQuery: string;
  userRole: ProfessionalRole;
}

type WorkspaceMode = "single" | "split" | "compare" | "multi";

export function ProjectViewer() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuthStore();
  const { currentProject, loadProject } = useProjectsStore();
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

  const [theme, setTheme] = useState<ViewerTheme>("dark");
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("single");
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>("none");
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [timelinePlaying, setTimelinePlaying] = useState(false);
  const [timelineSpeed, setTimelineSpeed] = useState(1);
  const [activeFloor, setActiveFloor] = useState("ground");
  const [wireframeActive, setWireframeActive] = useState(false);
  const [gridActive, setGridActive] = useState(true);
  const [xrayActive, setXrayActive] = useState(false);
  const [measureActive, setMeasureActive] = useState(false);
  const [clippingActive, setClippingActive] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isolatedType, setIsolatedType] = useState<string | null>(null);
  const [comments, setComments] = useState<ElementComment[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userRole, setUserRole] = useState<ProfessionalRole>("Architect");
  const [uiState, setUiState] = useState<{
    mode: UIMode;
    activePanel: ActivePanel;
    activeTool: ActiveTool;
    hudEnabled: boolean;
    navigatorCompact: boolean;
    selection: SelectedElementData | null;
  }>({
    mode: "VIEW",
    activePanel: "NONE",
    activeTool: "ORBIT",
    hudEnabled: false,
    navigatorCompact: true,
    selection: null,
  });
  const selectedElement = uiState.selection;
  const openProject = currentProject?.id === projectId ? currentProject : null;
  const loadStatusTimerRef = useRef<number | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const viewerCanvasHostRef = useRef<HTMLDivElement | null>(null);
  const [cameraState, setCameraState] = useState<null | { position: { x:number;y:number;z:number }; target?: { x:number;y:number;z:number } }>(null);
  useEffect(() => {
    let mounted = true;
    const poll = () => {
      try {
        const state = ifcViewerRef.current?.getCameraState?.();
        if (mounted && state) setCameraState(state);
      } catch {}
      if (mounted) requestAnimationFrame(poll);
    };
    poll();
    return () => { mounted = false; };
  }, []);
  const copy = useMemo(() => getViewerCopy(locale), [locale]);
  const projectDisplayName = openProject?.name ?? (projectId ? `Project ${projectId.slice(0, 8)}...` : copy.shell.title);
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
    setUiState((current) => ({ ...current, selection: null, mode: "VIEW", activePanel: "CONTEXT" }));

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
      setUiState((current) => ({
        ...current,
        selection: data,
        mode: data ? "SELECT" : "VIEW",
        activePanel: "CONTEXT",
      }));
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
    setUiState((current) => ({ ...current, selection: null }));
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
    setUiState((current) => ({ ...current, selection: null, mode: "VIEW", activePanel: "CONTEXT", activeTool: "ORBIT", hudEnabled: false }));
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

  const handleUploadClick = useCallback(() => {
    uploadInputRef.current?.click();
  }, []);

  const handleUploadInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];
      if (file) handleFileSelected(file);
      event.currentTarget.value = "";
    },
    [handleFileSelected],
  );

  const handleUiModeChange = useCallback((mode: UIMode) => {
    setUiState((current) => ({
      ...current,
      mode,
      activeTool:
        mode === "ANALYSIS"
          ? "HEATMAP"
          : mode === "SIMULATION"
            ? current.activeTool
            : mode === "SELECT"
              ? "SELECT"
              : "ORBIT",
      hudEnabled: mode !== "VIEW",
      activePanel: "CONTEXT",
    }));
  }, []);

  const handleToggleNavigatorCompact = useCallback(() => {
    setUiState((current) => ({ ...current, navigatorCompact: !current.navigatorCompact }));
  }, []);

  const handleUiToolChange = useCallback((activeTool: ActiveTool) => {
    setUiState((current) => ({
      ...current,
      activeTool,
      mode: activeTool === "HEATMAP" ? "ANALYSIS" : activeTool === "MEASURE" ? "SELECT" : current.mode,
      hudEnabled: activeTool !== "ORBIT",
    }));
  }, []);

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
  }, [uiState.activePanel, uiState.mode]);

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
    void loadProject(projectId);

    const stored = localStorage.getItem(`${PROJECT_SESSION_PREFIX}${projectId}`);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as Partial<ProjectSessionState>;
      if (typeof parsed.theme === "string" && VIEWER_THEMES.includes(parsed.theme as ViewerTheme)) {
        const restoredTheme = parsed.theme as ViewerTheme;
        setTheme(restoredTheme);
        document.documentElement.setAttribute("data-theme", restoredTheme);
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
      if (
        parsed.uiMode === "VIEW" ||
        parsed.uiMode === "SELECT" ||
        parsed.uiMode === "ANALYSIS" ||
        parsed.uiMode === "SIMULATION"
      ) {
        setUiState((current) => ({ ...current, mode: parsed.uiMode ?? current.mode }));
      }
      if (parsed.activePanel === "NONE" || parsed.activePanel === "NAVIGATION" || parsed.activePanel === "CONTEXT") {
        setUiState((current) => ({ ...current, activePanel: parsed.activePanel ?? current.activePanel }));
      }
      if (parsed.activeTool === "ORBIT" || parsed.activeTool === "SELECT" || parsed.activeTool === "PAN" || parsed.activeTool === "MEASURE" || parsed.activeTool === "HEATMAP") {
        setUiState((current) => ({ ...current, activeTool: parsed.activeTool ?? current.activeTool }));
      }
      if (typeof parsed.hudEnabled === "boolean") {
        setUiState((current) => ({ ...current, hudEnabled: parsed.hudEnabled ?? current.hudEnabled }));
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
  }, [loadProject, projectId]);

  useEffect(() => {
    if (!projectId) return;
    const sessionState: ProjectSessionState = {
      theme,
      workspaceMode,
      uiMode: uiState.mode,
      activePanel: uiState.activePanel,
      activeTool: uiState.activeTool,
      hudEnabled: uiState.hudEnabled,
      heatmapMode,
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
    uiState.mode,
    uiState.activePanel,
    uiState.activeTool,
    uiState.hudEnabled,
    heatmapMode,
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
        projectTitle={projectDisplayName}
      />

      <section className="project-shell-header">
        <div className="project-shell-copy">
          <p className="project-shell-kicker">{copy.shell.title}</p>
          <h1>{loadedInfo?.name ?? projectDisplayName}</h1>
          <p className="project-shell-subtitle">{openProject?.description || copy.shell.subtitle}</p>
        </div>
        <div className="project-shell-actions">
          <button type="button" className="project-shell-chip" onClick={handleUploadClick}>
            + Upload
          </button>
          <button type="button" className="project-shell-chip" onClick={handleToggleLocale}>
            {copy.localeLabel}: {copy.localeNames[locale]}
          </button>
          <button type="button" className="project-shell-chip" onClick={handleToggleTheme}>
            {copy.themeLabel}: {copy.themeNames[theme]}
          </button>
          <button type="button" className="project-shell-chip" onClick={() => setUiState((current) => ({ ...current, activePanel: "NAVIGATION" }))}>
            Navigator
          </button>
          <button type="button" className="project-shell-chip" onClick={() => setUiState((current) => ({ ...current, activePanel: "CONTEXT" }))}>
            Inspector
          </button>
          <button type="button" className="project-shell-chip" onClick={() => handleUiModeChange("VIEW")}>View</button>
          <button type="button" className="project-shell-chip" onClick={() => handleUiModeChange("SELECT")}>Select</button>
          <button type="button" className="project-shell-chip" onClick={() => handleUiModeChange("ANALYSIS")}>Analysis / 5D</button>
          <button type="button" className="project-shell-chip" onClick={() => handleUiModeChange("SIMULATION")}>4D Timeline</button>
          <span className="project-shell-status">{uiState.mode}</span>
          <span className="project-shell-status">{status || copy.shell.statusReady}</span>
        </div>
      </section>
      <section className="project-shell-metrics panel">
        <div className="project-shell-metric">
          <span className="project-shell-metric-label">Model types</span>
          <strong>{elementTypes.length}</strong>
        </div>
        <div className="project-shell-metric">
          <span className="project-shell-metric-label">Comments</span>
          <strong>{comments.length}</strong>
        </div>
        <div className="project-shell-metric">
          <span className="project-shell-metric-label">Activity</span>
          <strong>{activityItems.length}</strong>
        </div>
        <div className="project-shell-metric">
          <span className="project-shell-metric-label">Timeline</span>
          <strong>{TIMELINE_PHASES[timelinePhaseIndex]?.name ?? "Idle"}</strong>
        </div>
      </section>
      <input
        ref={uploadInputRef}
        type="file"
        accept=".ifc,.ifczip,.wexbim,.obj,.fbx,.glb,.gltf"
        onChange={handleUploadInputChange}
        style={{ display: "none" }}
      />

      <div className="project-layout project-layout-minimal">
        <div className="project-main">
          <div className="project-viewer-canvas">
            <div ref={viewerCanvasHostRef} className="project-viewer-canvas-host panel">
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
                <ToolDock
                  mode={uiState.mode}
                  activeTool={uiState.activeTool}
                  onModeChange={handleUiModeChange}
                  onToolChange={handleUiToolChange}
                  onMeasure={toggleMeasure}
                  onIsolate={() => { ifcViewerRef.current?.clearTypeIsolation(); }}
                  onHide={handleHideSelected}
                />
                <HUD
                  enabled={uiState.hudEnabled}
                  mode={uiState.mode}
                  selectedName={selectedElement?.name ?? selectedElement?.type ?? null}
                />
              </div>
              <ViewCube
                onSetView={(direction) =>
                  ifcViewerRef.current?.setViewAngle(direction)
                }
              />
            </div>
          </div>

          <div className="project-right-stack">
            <MiniMapNavigator
              floors={WORKSPACE_FLOORS}
              activeFloor={activeFloor}
              onFloorChange={handleFloorChange}
              onFitView={handleFitCamera}
              compact={uiState.navigatorCompact}
              onToggleCompact={handleToggleNavigatorCompact}
              copy={workspaceCopy}
              camera={cameraState}
            />

            <ContextInspector
              mode={uiState.mode}
              selection={selectedElement}
              projectId={projectId}
              comments={comments}
              activityItems={activityItems}
              searchQuery={searchQuery}
              searchResults={searchResults}
              searchChips={searchChips}
              heatmapMode={heatmapMode}
              timeline={{
                phases: TIMELINE_PHASES,
                currentPhaseIndex: timelinePhaseIndex,
                progress: timelineProgress,
                speed: timelineSpeed,
                playing: timelinePlaying,
              }}
              copy={copy}
              onSearchChange={setSearchQuery}
              onChipClick={setSearchQuery}
              onResultClick={(id) => {
                handleElementTypeClick(id);
                setUiState((current) => ({ ...current, mode: "SELECT", activePanel: "CONTEXT" }));
              }}
              onModeChange={handleUiModeChange}
              onHeatmapModeChange={setHeatmapMode}
              onTimelineProgressChange={setTimelineProgress}
              onTimelineSpeedChange={setTimelineSpeed}
              onTimelineTogglePlay={() => setTimelinePlaying((value) => !value)}
              getViewerCanvas={() => viewerCanvasHostRef.current?.querySelector("canvas") ?? null}
              onSelectDocument={handleFileSelected}
              onUploadClick={handleUploadClick}
              userName={user?.name ?? "Guest"}
              userRole={userRole}
              onAddComment={handleAddComment}
              onStepChange={handlePlanningStep}
              getQuantitySummary={handleGetQuantitySummary}
              getElementQuantity={handleGetElementQuantity}
              setElementProgress={handleSetElementProgress}
            />
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
