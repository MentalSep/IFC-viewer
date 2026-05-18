import { useState } from "react";
import { Icon } from "./ui/Icon";
import type { ViewerCopy } from "../utils/viewerI18n";

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
  onFocusSelected: () => void;
  onHideSelected: () => void;
  onShowAllElements: () => void;
  copy: ViewerCopy["toolbar"];
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
  onFocusSelected,
  onHideSelected,
  onShowAllElements,
  copy,
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
        title={copy.wire}
      >
        <span className="toolbar-icon">
          <Icon name="wireframe" />
        </span>
        <span className="toolbar-label">{copy.wire}</span>
      </button>
      <button
        className={`toolbar-btn${gridVisible ? " active" : ""}`}
        onClick={handleToggleGrid}
        title={copy.grid}
      >
        <span className="toolbar-icon">
          <Icon name="grid" />
        </span>
        <span className="toolbar-label">{copy.grid}</span>
      </button>
      <button
        className={`toolbar-btn${transparent ? " active" : ""}`}
        onClick={handleToggleTransparency}
        title={copy.xray}
      >
        <span className="toolbar-icon">
          <Icon name="xray" />
        </span>
        <span className="toolbar-label">{copy.xray}</span>
      </button>
      <div className="toolbar-divider" />
      <button
        className={`toolbar-btn${measuring ? " active" : ""}`}
        onClick={handleToggleMeasure}
        title={copy.measure}
      >
        <span className="toolbar-icon">
          <Icon name="measure" />
        </span>
        <span className="toolbar-label">{copy.measure}</span>
      </button>
      <button
        className="toolbar-btn"
        onClick={onClearMeasurements}
        title={copy.clear}
      >
        <span className="toolbar-icon">
          <Icon name="trash" />
        </span>
        <span className="toolbar-label">{copy.clear}</span>
      </button>
      <div className="toolbar-divider" />
      <div className="toolbar-clip-group">
        <button
          className={`toolbar-btn${clipping ? " active" : ""}`}
          onClick={handleToggleClipping}
          title={copy.clip}
        >
          <span className="toolbar-icon">
            <Icon name="clip" />
          </span>
          <span className="toolbar-label">{copy.clip}</span>
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
        <span className="toolbar-label">{copy.zoomIn}</span>
      </button>
      <button className="toolbar-btn" onClick={onZoomOut} title="Zoom out (-)">
        <span className="toolbar-icon">
          <Icon name="zoomOut" />
        </span>
        <span className="toolbar-label">{copy.zoomOut}</span>
      </button>
      <div className="toolbar-divider" />
      <button className="toolbar-btn" onClick={onFocusSelected} title={copy.focus}>
        <span className="toolbar-icon">
          <Icon name="eye" />
        </span>
        <span className="toolbar-label">{copy.focus}</span>
      </button>
      <button className="toolbar-btn" onClick={onHideSelected} title={copy.hide}>
        <span className="toolbar-icon">
          <Icon name="close" />
        </span>
        <span className="toolbar-label">{copy.hide}</span>
      </button>
      <button className="toolbar-btn" onClick={onShowAllElements} title={copy.showAll}>
        <span className="toolbar-icon">
          <Icon name="grid" />
        </span>
        <span className="toolbar-label">{copy.showAll}</span>
      </button>
      <div className="toolbar-divider" />
      <button
        className="toolbar-btn"
        onClick={onScreenshot}
        title={copy.screenshot}
      >
        <span className="toolbar-icon">
          <Icon name="camera" />
        </span>
        <span className="toolbar-label">{copy.screenshot}</span>
      </button>
      <button
        className="toolbar-btn"
        onClick={onShowShortcuts}
        title={copy.shortcuts}
      >
        <span className="toolbar-icon">
          <Icon name="keyboard" />
        </span>
        <span className="toolbar-label">{copy.shortcuts}</span>
      </button>
    </div>
  );
}

export default Toolbar;
