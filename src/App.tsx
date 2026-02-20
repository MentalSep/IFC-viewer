import { useState, useRef, useCallback, useEffect } from "react";
import IFCViewer from "./components/IFCViewer";
import type { IFCViewerRef } from "./components/IFCViewer";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Toolbar from "./components/Toolbar";
import PropertiesPanel from "./components/PropertiesPanel";
import type { SelectedElementData } from "./components/PropertiesPanel";
import type { ElementTypeInfo } from "./components/ModelTree";
import ElementComments from "./components/ElementComments";
import type {
  ElementComment,
  ProfessionalRole,
} from "./components/ElementComments";
import ViewCube from "./components/ViewCube";
import KeyboardShortcuts from "./components/KeyboardShortcuts";

function App() {
  const [ifcFile, setIfcFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [loadedInfo, setLoadedInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const viewerRef = useRef<IFCViewerRef | null>(null);

  // Theme
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("ifc-theme");
    return saved === "light" ? "light" : "dark";
  });

  // Model / viewer state
  const [elementTypes, setElementTypes] = useState<ElementTypeInfo[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<SelectedElementData | null>(null);
  const [wireframe, setWireframe] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [transparent, setTransparent] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [clipping, setClipping] = useState(false);
  const [clipHeight, setClipHeight] = useState(1);
  const [loadTimeMs, setLoadTimeMs] = useState<number | null>(null);
  const loadStartRef = useRef<number>(0);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Comments state
  const [comments, setComments] = useState<ElementComment[]>([]);

  // User identity (shared between chat & comments)
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState<ProfessionalRole>("Architect");

  // Shortcuts modal
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // ── Theme persistence ──
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ifc-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "f":
        case "F":
          viewerRef.current?.fitCamera();
          break;
        case "g":
        case "G": {
          const val = viewerRef.current?.toggleGrid();
          if (val !== undefined) setGridVisible(val);
          break;
        }
        case "w":
        case "W": {
          const val = viewerRef.current?.toggleWireframe();
          if (val !== undefined) setWireframe(val);
          break;
        }
        case "t":
        case "T": {
          const val = viewerRef.current?.toggleTransparency();
          if (val !== undefined) setTransparent(val);
          break;
        }
        case "m":
        case "M": {
          const val = viewerRef.current?.toggleMeasure();
          if (val !== undefined) setMeasuring(val);
          break;
        }
        case "c":
        case "C":
          viewerRef.current?.clearMeasurements();
          break;
        case "p":
        case "P":
          viewerRef.current?.screenshot();
          break;
        case "l":
        case "L":
          toggleTheme();
          break;
        case "Escape":
          setSelectedElement(null);
          setShortcutsOpen(false);
          break;
        case "?":
          setShortcutsOpen((v) => !v);
          break;
        case "+":
        case "=":
          viewerRef.current?.zoomIn();
          break;
        case "-":
          viewerRef.current?.zoomOut();
          break;
        case "1":
          viewerRef.current?.setViewAngle("top");
          break;
        case "2":
          viewerRef.current?.setViewAngle("front");
          break;
        case "3":
          viewerRef.current?.setViewAngle("right");
          break;
        case "4":
          viewerRef.current?.setViewAngle("back");
          break;
        case "5":
          viewerRef.current?.setViewAngle("left");
          break;
        case "6":
          viewerRef.current?.setViewAngle("bottom");
          break;
        case "0":
          viewerRef.current?.setViewAngle("iso");
          break;
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [toggleTheme]);

  // ── Handlers ──

  const handleFileSelected = useCallback((file: File) => {
    setIfcFile(file);
    setLoadedInfo({ name: file.name, size: formatSize(file.size) });
    setStatus(`Loading ${file.name}...`);
    setElementTypes([]);
    setSelectedElement(null);
    setComments([]);
    setLoadTimeMs(null);
    setSearchQuery("");
    setClipping(false);
    setClipHeight(1);
    loadStartRef.current = performance.now();
  }, []);

  const handleLoadComplete = useCallback(() => {
    const elapsed = performance.now() - loadStartRef.current;
    setLoadTimeMs(elapsed);
    setStatus("Model loaded ✓");
  }, []);

  const handleError = useCallback((err: string) => {
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

  const handleElementTypeClick = useCallback((_type: string) => {
    // placeholder — could highlight all elements of this type
  }, []);

  const handleAddComment = useCallback((comment: ElementComment) => {
    setComments((prev) => [...prev, comment]);
  }, []);

  const handleUserReady = useCallback(
    (name: string, role: ProfessionalRole) => {
      setUserName(name);
      setUserRole(role);
    },
    [],
  );

  const handleClipHeightChange = useCallback((ratio: number) => {
    setClipHeight(ratio);
    viewerRef.current?.setClipHeight(ratio);
  }, []);

  // ── Render ──

  return (
    <div className="app-shell" data-theme={theme}>
      {/* Left sidebar */}
      <Sidebar
        onFileSelected={handleFileSelected}
        status={status}
        loadedInfo={loadedInfo}
        onFitCamera={() => viewerRef.current?.fitCamera()}
        onResetCamera={() => viewerRef.current?.resetCamera()}
        elementTypes={elementTypes}
        onElementTypeClick={handleElementTypeClick}
        loadTimeMs={loadTimeMs}
        comments={comments}
        theme={theme}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Center viewer */}
      <div className="panel viewer-panel">
        <IFCViewer
          ref={viewerRef}
          file={ifcFile}
          onLoad={handleLoadComplete}
          onError={handleError}
          onElementTypesReady={handleElementTypesReady}
          onElementSelected={handleElementSelected}
          theme={theme}
        />
        <Toolbar
          wireframe={wireframe}
          gridVisible={gridVisible}
          transparent={transparent}
          measuring={measuring}
          clipping={clipping}
          clipHeight={clipHeight}
          onToggleWireframe={() => {
            const val = viewerRef.current?.toggleWireframe();
            if (val !== undefined) setWireframe(val);
          }}
          onToggleGrid={() => {
            const val = viewerRef.current?.toggleGrid();
            if (val !== undefined) setGridVisible(val);
          }}
          onToggleTransparency={() => {
            const val = viewerRef.current?.toggleTransparency();
            if (val !== undefined) setTransparent(val);
          }}
          onScreenshot={() => viewerRef.current?.screenshot()}
          onZoomIn={() => viewerRef.current?.zoomIn()}
          onZoomOut={() => viewerRef.current?.zoomOut()}
          onToggleMeasure={() => {
            const val = viewerRef.current?.toggleMeasure();
            if (val !== undefined) setMeasuring(val);
          }}
          onClearMeasurements={() => viewerRef.current?.clearMeasurements()}
          onToggleClipping={() => {
            const val = viewerRef.current?.toggleClipping();
            if (val !== undefined) setClipping(val);
          }}
          onClipHeightChange={handleClipHeightChange}
          onShowShortcuts={() => setShortcutsOpen(true)}
        />
        <ViewCube onSetView={(dir) => viewerRef.current?.setViewAngle(dir)} />
        <PropertiesPanel
          data={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      </div>

      {/* Right panel — chat + element comments */}
      <div className="right-panel">
        <Chat
          fileName={loadedInfo?.name ?? null}
          onUserReady={handleUserReady}
        />
        <ElementComments
          selectedExpressId={selectedElement?.expressId ?? null}
          selectedElementType={selectedElement?.type ?? null}
          comments={comments}
          onAddComment={handleAddComment}
          userName={userName}
          userRole={userRole}
        />
      </div>

      {/* Modals */}
      <KeyboardShortcuts
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default App;
