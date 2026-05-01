import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../services/state/useAuthStore";
import IFCViewer, { type IFCViewerRef } from "../components/IFCViewer";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Toolbar";
import PropertiesPanel from "../components/PropertiesPanel";
import Chat from "../components/Chat";
import KeyboardShortcuts from "../components/KeyboardShortcuts";
import ViewCube from "../components/ViewCube";

import type { ElementTypeInfo } from "../components/ModelTree";
import type { SelectedElementData } from "../components/PropertiesPanel";
import "../styles/global.css";

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

  // Blank canvas - user uploads file

  const handleFileSelected = (file: File) => {
    const startTime = performance.now();
    setLoadedFile(file);
    setLoadedInfo({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
    });
    setStatus("Loading...");
    setSelectedElement(null);

    const timer = setTimeout(() => {
      const endTime = performance.now();
      setLoadTimeMs(endTime - startTime);
      setStatus("Model loaded successfully");
    }, 1000);

    return () => clearTimeout(timer);
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

  return (
    <div className="app-container" data-theme={theme}>
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "50px",
          background: "var(--panel)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--accent)",
              cursor: "pointer",
              fontSize: "16px",
              padding: "4px 8px",
            }}
          >
            ← Dashboard
          </button>
          <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
            Project {projectId?.slice(0, 8)}...
          </h1>
          <span style={{ fontSize: "13px", color: "var(--muted)" }}>
            {user?.name}
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
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
          Back to Dashboard
        </button>
      </div>

      {/* Main Layout */}
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 50px)",
          marginTop: "50px",
        }}
      >
        {/* Left Sidebar */}
        {showLeftSidebar && (
          <div
            style={{
              width: "320px",
              borderRight: "1px solid var(--border)",
              overflow: "auto",
              background: "var(--panel)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "8px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowLeftSidebar(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  padding: "4px 8px",
                  fontSize: "14px",
                }}
                title="Close sidebar"
              >
                ✕
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
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Toggle Left Sidebar Button */}
          {!showLeftSidebar && (
            <button
              onClick={() => setShowLeftSidebar(true)}
              style={{
                position: "absolute",
                top: "62px",
                left: "8px",
                zIndex: 100,
                background: "var(--panel)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                cursor: "pointer",
                padding: "6px 10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
              title="Open sidebar"
            >
              ☰
            </button>
          )}
          {/* Toolbar */}
          <div
            style={{
              height: "60px",
              borderBottom: "1px solid var(--border)",
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              background: "var(--panel-2)",
              gap: "4px",
              overflow: "auto",
            }}
          >
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
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* 3D Viewer */}
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
              <ViewCube
                onSetView={(direction) =>
                  ifcViewerRef.current?.setViewAngle(direction)
                }
              />

              {/* Toggle Right Sidebar Button */}
              {!showRightSidebar && (
                <button
                  onClick={() => setShowRightSidebar(true)}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "8px",
                    zIndex: 100,
                    background: "var(--panel)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    cursor: "pointer",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                  title="Open properties panel"
                >
                  ☰
                </button>
              )}
            </div>

            {/* Right Panels */}
            {showRightSidebar && (
              <div
                style={{
                  width: "300px",
                  borderLeft: "1px solid var(--border)",
                  background: "var(--panel)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => setShowRightSidebar(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--muted)",
                      cursor: "pointer",
                      padding: "4px 8px",
                      fontSize: "14px",
                    }}
                    title="Close panel"
                  >
                    ✕
                  </button>
                </div>
                {selectedElement ? (
                  <PropertiesPanel
                    data={selectedElement}
                    onClose={() => setSelectedElement(null)}
                  />
                ) : (
                  <div
                    style={{
                      padding: "16px",
                      color: "var(--muted)",
                      fontSize: "13px",
                    }}
                  >
                    Select an element to view properties
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat */}
      <Chat fileName={loadedInfo?.name ?? null} />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
