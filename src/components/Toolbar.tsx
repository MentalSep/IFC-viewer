import { useState } from "react";
import { Icon } from "./ui/Icon";

interface ToolbarProps {
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
  // Local state for button display - doesn't trigger parent re-renders
  const [wireframe, setWireframe] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [transparent, setTransparent] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [clipping, setClipping] = useState(false);
  const [clipHeight, setClipHeight] = useState(0.5);

  const handleToggleWireframe = () => {
    setWireframe(!wireframe);
    onToggleWireframe();
  };

  const handleToggleGrid = () => {
    setGridVisible(!gridVisible);
    onToggleGrid();
  };

  const handleToggleTransparency = () => {
    setTransparent(!transparent);
    onToggleTransparency();
  };

  const handleToggleMeasure = () => {
    setMeasuring(!measuring);
    onToggleMeasure();
  };

  const handleToggleClipping = () => {
    setClipping(!clipping);
    onToggleClipping();
  };

  const handleClipHeightChange = (ratio: number) => {
    setClipHeight(ratio);
    onClipHeightChange(ratio);
  };
  return (
    <div className="toolbar">
      <button
        className={`toolbar-btn${wireframe ? " active" : ""}`}
        onClick={handleToggleWireframe}
        title="Toggle wireframe (W)"
      >
        <span className="toolbar-icon">
          <Icon name="wireframe" />
        </span>
        <span className="toolbar-label">Wire</span>
      </button>
      <button
        className={`toolbar-btn${gridVisible ? " active" : ""}`}
        onClick={handleToggleGrid}
        title="Toggle grid (G)"
      >
        <span className="toolbar-icon">
          <Icon name="grid" />
        </span>
        <span className="toolbar-label">Grid</span>
      </button>
      <button
        className={`toolbar-btn${transparent ? " active" : ""}`}
        onClick={handleToggleTransparency}
        title="Toggle transparency / X-ray (T)"
      >
        <span className="toolbar-icon">
          <Icon name="xray" />
        </span>
        <span className="toolbar-label">X-Ray</span>
      </button>
      <div className="toolbar-divider" />
      <button
        className={`toolbar-btn${measuring ? " active" : ""}`}
        onClick={handleToggleMeasure}
        title="Measure distance — click two points (M)"
      >
        <span className="toolbar-icon">
          <Icon name="measure" />
        </span>
        <span className="toolbar-label">Meas</span>
      </button>
      <button
        className="toolbar-btn"
        onClick={onClearMeasurements}
        title="Clear measurements (C)"
      >
        <span className="toolbar-icon">
          <Icon name="trash" />
        </span>
        <span className="toolbar-label">Clear</span>
      </button>
      <div className="toolbar-divider" />
      <div className="toolbar-clip-group">
        <button
          className={`toolbar-btn${clipping ? " active" : ""}`}
          onClick={handleToggleClipping}
          title="Toggle section plane"
        >
          <span className="toolbar-icon">
            <Icon name="clip" />
          </span>
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
            onChange={(e) => handleClipHeightChange(parseFloat(e.target.value))}
            title={`Clip height: ${Math.round(clipHeight * 100)}%`}
          />
        )}
      </div>
      <div className="toolbar-divider" />
      <button className="toolbar-btn" onClick={onZoomIn} title="Zoom in (+)">
        <span className="toolbar-icon">
          <Icon name="zoomIn" />
        </span>
        <span className="toolbar-label">In</span>
      </button>
      <button className="toolbar-btn" onClick={onZoomOut} title="Zoom out (-)">
        <span className="toolbar-icon">
          <Icon name="zoomOut" />
        </span>
        <span className="toolbar-label">Out</span>
      </button>
      <div className="toolbar-divider" />
      <button
        className="toolbar-btn"
        onClick={onScreenshot}
        title="Save screenshot as PNG (P)"
      >
        <span className="toolbar-icon">
          <Icon name="camera" />
        </span>
        <span className="toolbar-label">Snap</span>
      </button>
      <button
        className="toolbar-btn"
        onClick={onShowShortcuts}
        title="Keyboard shortcuts (?)"
      >
        <span className="toolbar-icon">
          <Icon name="keyboard" />
        </span>
        <span className="toolbar-label">Keys</span>
      </button>
    </div>
  );
}

export default Toolbar;
