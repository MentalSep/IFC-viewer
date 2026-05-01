import { useRef, DragEvent, ChangeEvent, useState, useCallback } from "react";
import ModelTree, { type ElementTypeInfo } from "./ModelTree";
import ModelStats from "./ModelStats";
import ThemeToggle from "./ThemeToggle";
import SearchFilter from "./SearchFilter";

interface SidebarProps {
  onFileSelected: (file: File) => void;
  status: string;
  loadedInfo: { name: string; size: string } | null;
  onFitCamera: () => void;
  onResetCamera: () => void;
  elementTypes: ElementTypeInfo[];
  onElementTypeClick: (type: string) => void;
  loadTimeMs: number | null;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

function Sidebar({
  onFileSelected,
  status,
  loadedInfo,
  onFitCamera,
  onResetCamera,
  elementTypes,
  onElementTypeClick,
  loadTimeMs,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.name.endsWith(".ifc")) {
        onFileSelected(file);
      }
    },
    [onFileSelected],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelected(file);
      }
    },
    [onFileSelected],
  );

  // Filter element types by search query
  const filteredElements = searchQuery
    ? elementTypes.filter((el) =>
        el.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : elementTypes;

  return (
    <aside className="panel">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-logo">🏗️</span>
          <div>
            <h1>IFC Viewer</h1>
            <p>Load and explore IFC building models in 3D.</p>
          </div>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="controls">
        <div
          className={"dropzone" + (dragging ? " dragging" : "")}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <strong>Upload IFC File</strong>
          <span className="helper-text">Drag & drop or click to browse</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".ifc"
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="button-row">
          <button className="button" onClick={onFitCamera}>
            📐 Fit View
          </button>
          <button className="button" onClick={onResetCamera}>
            🔄 Reset
          </button>
        </div>

        {loadedInfo && (
          <p className="status">
            <strong>{loadedInfo.name}</strong> — {loadedInfo.size}
          </p>
        )}

        {status && <p className="status">{status}</p>}

        <ModelStats
          fileName={loadedInfo?.name ?? null}
          fileSize={loadedInfo?.size ?? null}
          elementTypes={elementTypes}
          loadTimeMs={loadTimeMs}
        />

        {elementTypes.length > 0 && (
          <SearchFilter
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search element types..."
          />
        )}

        <ModelTree
          elements={filteredElements}
          onElementTypeClick={onElementTypeClick}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
