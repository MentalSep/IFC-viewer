interface ToolbarProps {
  wireframe: boolean;
  gridVisible: boolean;
  transparent: boolean;
  measuring: boolean;
  clipping: boolean;
  clipHeight: number;
  onToggleWireframe: () => void;
  onToggleGrid: () => void;
  onToggleTransparency: () => void;
  onScreenshot: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleMeasure: () => void;
  onClearMeasurements: () => void;
  onToggleClipping: () => void;
  onClipHeightChange: (ratio: number) => void;
  onShowShortcuts: () => void;
}

function Toolbar({
  wireframe,
  gridVisible,
  transparent,
  measuring,
  clipping,
  clipHeight,
  onToggleWireframe,
  onToggleGrid,
  onToggleTransparency,
  onScreenshot,
  onZoomIn,
  onZoomOut,
  onToggleMeasure,
  onClearMeasurements,
  onToggleClipping,
  onClipHeightChange,
  onShowShortcuts,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <button
        className={`toolbar-btn${wireframe ? " active" : ""}`}
        onClick={onToggleWireframe}
        title="Toggle wireframe (W)"
      >
        <span className="toolbar-icon">◻</span>
        <span className="toolbar-label">Wire</span>
      </button>
      <button
        className={`toolbar-btn${gridVisible ? " active" : ""}`}
        onClick={onToggleGrid}
        title="Toggle grid (G)"
      >
        <span className="toolbar-icon">▦</span>
        <span className="toolbar-label">Grid</span>
      </button>
      <button
        className={`toolbar-btn${transparent ? " active" : ""}`}
        onClick={onToggleTransparency}
        title="Toggle transparency / X-ray (T)"
      >
        <span className="toolbar-icon">◐</span>
        <span className="toolbar-label">X-Ray</span>
      </button>
      <div className="toolbar-divider" />
      <button
        className={`toolbar-btn${measuring ? " active" : ""}`}
        onClick={onToggleMeasure}
        title="Measure distance — click two points (M)"
      >
        <span className="toolbar-icon">📏</span>
        <span className="toolbar-label">Meas</span>
      </button>
      <button
        className="toolbar-btn"
        onClick={onClearMeasurements}
        title="Clear measurements (C)"
      >
        <span className="toolbar-icon">🗑</span>
        <span className="toolbar-label">Clear</span>
      </button>
      <div className="toolbar-divider" />
      <div className="toolbar-clip-group">
        <button
          className={`toolbar-btn${clipping ? " active" : ""}`}
          onClick={onToggleClipping}
          title="Toggle section plane"
        >
          <span className="toolbar-icon">✂️</span>
          <span className="toolbar-label">Clip</span>
        </button>
        {clipping && (
          <input
            type="range"
            className="toolbar-clip-slider"
            min={0}
            max={1}
            step={0.01}
            value={clipHeight}
            onChange={(e) => onClipHeightChange(parseFloat(e.target.value))}
            title={`Clip height: ${Math.round(clipHeight * 100)}%`}
          />
        )}
      </div>
      <div className="toolbar-divider" />
      <button className="toolbar-btn" onClick={onZoomIn} title="Zoom in (+)">
        <span className="toolbar-icon">＋</span>
        <span className="toolbar-label">In</span>
      </button>
      <button className="toolbar-btn" onClick={onZoomOut} title="Zoom out (-)">
        <span className="toolbar-icon">−</span>
        <span className="toolbar-label">Out</span>
      </button>
      <div className="toolbar-divider" />
      <button
        className="toolbar-btn"
        onClick={onScreenshot}
        title="Save screenshot as PNG (P)"
      >
        <span className="toolbar-icon">📷</span>
        <span className="toolbar-label">Snap</span>
      </button>
      <button
        className="toolbar-btn"
        onClick={onShowShortcuts}
        title="Keyboard shortcuts (?)"
      >
        <span className="toolbar-icon">⌨️</span>
        <span className="toolbar-label">Keys</span>
      </button>
    </div>
  );
}

export default Toolbar;
