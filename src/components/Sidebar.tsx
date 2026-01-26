import { useRef, DragEvent, ChangeEvent, useState, useCallback } from "react";

interface SidebarProps {
  onFileSelected: (file: File) => void;
  onLoadSample: () => void;
  status: string;
  loadedInfo: { name: string; size: string } | null;
  onFitCamera: () => void;
  onResetCamera: () => void;
}

function Sidebar({
  onFileSelected,
  onLoadSample,
  status,
  loadedInfo,
  onFitCamera,
  onResetCamera,
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

  return (
    <aside className="panel">
      <h1>IFC Viewer</h1>
      <p>Load and explore IFC building models in 3D.</p>
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
          <button className="button primary" onClick={onLoadSample}>
            Load Sample
          </button>
          <button className="button" onClick={onFitCamera}>
            Fit View
          </button>
          <button className="button" onClick={onResetCamera}>
            Reset
          </button>
        </div>

        {loadedInfo && (
          <p className="status">
            <strong>{loadedInfo.name}</strong> — {loadedInfo.size}
          </p>
        )}

        {status && <p className="status">{status}</p>}
      </div>
    </aside>
  );
}

export default Sidebar;
