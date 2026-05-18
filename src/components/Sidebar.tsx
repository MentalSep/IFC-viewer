import { useRef, DragEvent, ChangeEvent, useState, useCallback } from "react";
import ModelTree, { type ElementTypeInfo } from "./ModelTree";
import ModelStats from "./ModelStats";
import ThemeToggle from "./ThemeToggle";
import SearchFilter from "./SearchFilter";
import {
  getPreviewable3DAccept,
  isPreviewable3DFileName,
} from "../utils/modelFormats";
import type { ViewerCopy, ViewerTheme } from "../utils/viewerI18n";

interface SidebarProps {
  onFileSelected: (file: File) => void;
  status: string;
  loadedInfo: { name: string; size: string } | null;
  onFitCamera: () => void;
  onResetCamera: () => void;
  onClearModel: () => void;
  elementTypes: ElementTypeInfo[];
  onElementTypeClick: (type: string) => void;
  loadTimeMs: number | null;
  theme: ViewerTheme;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  copy: ViewerCopy["sidebar"];
  themeLabel: string;
  themeName: string;
  onLocaleChange: () => void;
  localeLabel: string;
  localeName: string;
}

function Sidebar({
  onFileSelected,
  status,
  loadedInfo,
  onFitCamera,
  onResetCamera,
  onClearModel,
  elementTypes,
  onElementTypeClick,
  loadTimeMs,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  copy,
  themeLabel,
  themeName,
  onLocaleChange,
  localeLabel,
  localeName,
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && isPreviewable3DFileName(file.name)) {
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
          <span className="sidebar-logo">IFC</span>
          <div>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
        </div>
        <div className="sidebar-header-actions">
          <button className="sidebar-pill" onClick={onLocaleChange} type="button">
            {localeLabel}: {localeName}
          </button>
          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
            label={`${themeLabel}: ${themeName}`}
          />
        </div>
      </div>

      <div className="controls">
        <div
          className={"dropzone" + (dragging ? " dragging" : "")}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <strong>{copy.uploadTitle}</strong>
          <span className="helper-text">{copy.uploadHint}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={getPreviewable3DAccept()}
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="button-row">
          <button className="button" onClick={onFitCamera} type="button">
            {copy.fitView}
          </button>
          <button className="button" onClick={onResetCamera} type="button">
            {copy.reset}
          </button>
          <button className="button" onClick={onClearModel} type="button">
            {copy.clear}
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
          labels={{
            title: copy.modelInfo,
            elements: copy.elements,
            types: copy.types,
            size: copy.size,
            loadTime: copy.loadTime,
            empty: copy.noElements,
          }}
        />

        {elementTypes.length > 0 && (
          <SearchFilter
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={copy.searchPlaceholder}
          />
        )}

        <ModelTree
          elements={filteredElements}
          onElementTypeClick={onElementTypeClick}
          labels={{ title: copy.elements, empty: copy.noElements }}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
