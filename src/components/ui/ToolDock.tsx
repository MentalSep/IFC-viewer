import { Icon } from "../ui/Icon";

export type UIMode = "VIEW" | "SELECT" | "ANALYSIS" | "SIMULATION";
export type ActiveTool = "ORBIT" | "SELECT" | "PAN" | "MEASURE" | "HEATMAP";

interface ToolDockProps {
  mode: UIMode;
  activeTool: ActiveTool;
  onModeChange: (mode: UIMode) => void;
  onToolChange: (tool: ActiveTool) => void;
  onMeasure: () => void;
  onIsolate: () => void;
  onHide: () => void;
}

export function ToolDock({
  mode,
  activeTool,
  onModeChange,
  onToolChange,
  onMeasure,
  onIsolate,
  onHide,
}: ToolDockProps) {
  return (
    <div className="panel tool-dock" style={{ position: "absolute", left: 18, top: 140 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          className={`panel-compact-action ${mode === "VIEW" ? "active" : ""}`}
          title="View"
          onClick={() => onModeChange("VIEW")}
        >
          <Icon name="eye" />
        </button>
        <button
          className={`panel-compact-action ${mode === "SELECT" ? "active" : ""}`}
          title="Select"
          onClick={() => onModeChange("SELECT")}
        >
          <Icon name="cube" />
        </button>
        <button
          className={`panel-compact-action ${mode === "ANALYSIS" ? "active" : ""}`}
          title="Analysis"
          onClick={() => onModeChange("ANALYSIS")}
        >
          <Icon name="flame" />
        </button>
        <button
          className={`panel-compact-action ${mode === "SIMULATION" ? "active" : ""}`}
          title="Simulation"
          onClick={() => onModeChange("SIMULATION")}
        >
          <Icon name="calendar" />
        </button>
        <div style={{ height: 8 }} />
        <button
          className={`panel-compact-action ${activeTool === "MEASURE" ? "active" : ""}`}
          title="Measure"
          onClick={() => {
            onToolChange("MEASURE");
            onMeasure();
          }}
        >
          <Icon name="measure" />
        </button>
        <button className="panel-compact-action" title="Isolate" onClick={onIsolate}>
          <Icon name="grid" />
        </button>
        <button className="panel-compact-action" title="Hide" onClick={onHide}>
          <Icon name="close" />
        </button>
      </div>
    </div>
  );
}
