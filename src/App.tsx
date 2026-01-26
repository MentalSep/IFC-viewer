import { useState, useRef, useCallback } from "react";
import IFCViewer from "./components/IFCViewer";
import Sidebar from "./components/Sidebar";

function App() {
  const [ifcFile, setIfcFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [loadedInfo, setLoadedInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const viewerRef = useRef<{
    fitCamera: () => void;
    resetCamera: () => void;
  } | null>(null);

  const handleFileSelected = useCallback((file: File) => {
    setIfcFile(file);
    setLoadedInfo({ name: file.name, size: formatSize(file.size) });
    setStatus(`Loading ${file.name}...`);
  }, []);

  const handleLoadComplete = useCallback(() => {
    setStatus("Model loaded ✓");
  }, []);

  const handleError = useCallback((err: string) => {
    setStatus(`Error: ${err}`);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        onFileSelected={handleFileSelected}
        status={status}
        loadedInfo={loadedInfo}
        onFitCamera={() => viewerRef.current?.fitCamera()}
        onResetCamera={() => viewerRef.current?.resetCamera()}
      />
      <div className="panel viewer-panel">
        <IFCViewer
          ref={viewerRef}
          file={ifcFile}
          onLoad={handleLoadComplete}
          onError={handleError}
        />
      </div>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default App;
