import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../services/state/useAuthStore";
import IFCViewer, { type IFCViewerRef } from "../components/IFCViewer";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Toolbar";
import PropertiesPanel from "../components/PropertiesPanel";
import Chat from "../components/Chat";
import KeyboardShortcuts from "../components/KeyboardShortcuts";
import ViewCube from "../components/ViewCube";
import ElementComments, {
  type ElementComment,
} from "../components/ElementComments";
import type { ElementTypeInfo } from "../components/ModelTree";
import type { SelectedElementData } from "../components/PropertiesPanel";
import "../styles/global.css";

export function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const ifcViewerRef = useRef<IFCViewerRef>(null);

  const [loadedFile, setLoadedFile] = useState<File | null>(null);
  const [loadedInfo, setLoadedInfo] = useState<{ name: string; size: string } | null>(null);
  const [status, setStatus] = useState("Ready to load IFC file");
  const [loadTimeMs, setLoadTimeMs] = useState<number | null>(null);
  const [wireframe, setWireframe] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [transparent, setTransparent] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [clipping, setClipping] = useState(false);
  const [clipHeight, setClipHeight] = useState(0.5);
  const [elementTypes, setElementTypes] = useState<ElementTypeInfo[]>([]);
  const [selectedElement, setSelectedElement] = useState<SelectedElementData | null>(null);
  const [comments, setComments] = useState<ElementComment[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadDefaultFile = async () => {
      try {
        setStatus("Loading default test model...");
        const response = await fetch("/test.ifc");
        const blob = await response.blob();
        const file = new File([blob], "test.ifc", { type: "application/ifc" });
        setLoadedFile(file);
        setLoadedInfo({ name: "test.ifc", size: (blob.size / 1024 / 1024).toFixed(2) + " MB" });
        setStatus("Model loaded successfully");
      } catch (error) {
        console.error("Failed to load default file:", error);
        setStatus("Failed to load default model. Upload an IFC file to continue.");
      }
    };
    loadDefaultFile();
  }, []);

  const handleFileSelected = (file: File) => {
    const startTime = performance.now();
    setLoadedFile(file);
    setLoadedInfo({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + " MB" });
    setStatus("Loading...");
    setSelectedElement(null);
    setComments([]);
    const timer = setTimeout(() => {
      setLoadTimeMs(performance.now() - startTime);
      setStatus("Model loaded successfully");
    }, 1000);
    return () => clearTimeout(timer);
  };

  const handleViewerLoad = () => setStatus("Model loaded successfully");
  const handleViewerError = (err: string) => setStatus(`Error: ${err}`);
  const handleElementTypesReady = (types: ElementTypeInfo[]) => setElementTypes(types);
  const handleElementSelected = (data: SelectedElementData | null) => setSelectedElement(data);
  const handleFitCamera = () => ifcViewerRef.current?.fitCamera();
  const handleResetCamera = () => ifcViewerRef.current?.resetCamera();
  const handleToggleWireframe = () => setWireframe(ifcViewerRef.current?.toggleWireframe() ?? false);
  const handleToggleGrid = () => setGridVisible(ifcViewerRef.current?.toggleGrid() ?? false);
  const handleToggleTransparency = () => setTransparent(ifcViewerRef.current?.toggleTransparency() ?? false);
  const handleScreenshot = () => ifcViewerRef.current?.screenshot();
  const handleZoomIn = () => ifcViewerRef.current?.zoomIn();
  const handleZoomOut = () => ifcViewerRef.current?.zoomOut();
  const handleToggleMeasure = () => setMeasuring(ifcViewerRef.current?.toggleMeasure() ?? false);
  const handleClearMeasurements = () => ifcViewerRef.current?.clearMeasurements();
  const handleToggleClipping = () => setClipping(ifcViewerRef.current?.toggleClipping() ?? false);
  const handleClipHeightChange = (ratio: number) => {
    setClipHeight(ratio);
    ifcViewerRef.current?.setClipHeight(ratio);
  };
  const handleToggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };
  const handleElementTypeClick = (_type: string) => {};
  const handleAddComment = (elementId: number, text: string) => {
    setComments([...comments, { id: Date.now(), elementId, text, timestamp: new Date() }]);
  };
  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter((c) => c.id !== commentId));
  };

  return (
    <div className="app-container" data-theme={theme}>
      {/* Header */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "50px",
        background: "var(--panel)", borderBottom: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 20px", zIndex: 1000, boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>CoBIM Cloud</h1>
          <span style={{ fontSize: "13px", color: "var(--muted)" }}>{user?.name}</span>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* ✅ Bouton Teams */}
          <button
            onClick={() => navigate("/teams")}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            💬 Teams
          </button>

          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              background: "var(--accent)",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: "flex", height: "calc(100vh - 50px)", marginTop: "50px" }}>
        {/* Sidebar */}
        <div style={{ width: "320px", borderRight: "1px solid var(--border)", overflow: "auto", background: "var(--panel)" }}>
          <Sidebar
            onFileSelected={handleFileSelected}
            status={status}
            loadedInfo={loadedInfo}
            onFitCamera={handleFitCamera}
            onResetCamera={handleResetCamera}
            elementTypes={elementTypes}
            onElementTypeClick={handleElementTypeClick}
            loadTimeMs={loadTimeMs}
            comments={comments}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Main Viewer */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          {/* Toolbar */}
          <div style={{
            height: "60px", borderBottom: "1px solid var(--border)",
            padding: "0 12px", display: "flex", alignItems: "center",
            background: "var(--panel-2)", gap: "4px", overflow: "auto",
          }}>
            <Toolbar
              wireframe={wireframe} gridVisible={gridVisible} transparent={transparent}
              measuring={measuring} clipping={clipping} clipHeight={clipHeight}
              onToggleWireframe={handleToggleWireframe} onToggleGrid={handleToggleGrid}
              onToggleTransparency={handleToggleTransparency} onScreenshot={handleScreenshot}
              onZoomIn={handleZoomIn} onZoomOut={handleZoomOut}
              onToggleMeasure={handleToggleMeasure} onClearMeasurements={handleClearMeasurements}
              onToggleClipping={handleToggleClipping} onClipHeightChange={handleClipHeightChange}
              onShowShortcuts={() => setShowShortcuts(true)}
            />
          </div>

          {/* Viewer + Right Panels */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <IFCViewer
                ref={ifcViewerRef}
                file={loadedFile}
                onLoad={handleViewerLoad}
                onError={handleViewerError}
                onElementTypesReady={handleElementTypesReady}
                onElementSelected={handleElementSelected}
                theme={theme}
              />
              <ViewCube onSetView={(dir) => ifcViewerRef.current?.setViewAngle(dir)} />
            </div>

            {/* Right Panels */}
            <div style={{
              width: "300px", borderLeft: "1px solid var(--border)",
              background: "var(--panel)", display: "flex",
              flexDirection: "column", overflow: "hidden",
            }}>
              {selectedElement ? (
                <>
                  <PropertiesPanel data={selectedElement} />
                  <ElementComments
                    elementId={selectedElement.expressId}
                    comments={comments.filter((c) => c.elementId === selectedElement.expressId)}
                    onAddComment={(text) => handleAddComment(selectedElement.expressId, text)}
                    onDeleteComment={handleDeleteComment}
                  />
                </>
              ) : (
                <div style={{ padding: "16px", color: "var(--muted)", fontSize: "13px" }}>
                  Select an element to view properties
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Chat theme={theme} />
      {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}