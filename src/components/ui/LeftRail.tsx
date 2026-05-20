import { Icon } from "../ui/Icon";

export type ActivePanel = "NONE" | "NAVIGATION" | "CONTEXT";

interface LeftRailProps {
  activePanel: ActivePanel;
  onOpenPanel: (panel: ActivePanel) => void;
}

export function LeftRail({ activePanel, onOpenPanel }: LeftRailProps) {
  return (
    <aside className="panel left-rail" aria-hidden={false} style={{ padding: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
        <button className={`panel-compact-action ${activePanel === "NAVIGATION" ? "active" : ""}`} title="Model Tree" onClick={() => onOpenPanel("NAVIGATION")}>
          <Icon name="cube" />
        </button>
        <button className={`panel-compact-action ${activePanel === "CONTEXT" ? "active" : ""}`} title="Documents" onClick={() => onOpenPanel("CONTEXT")}>
          <Icon name="folder" />
        </button>
        <button className={`panel-compact-action ${activePanel === "NONE" ? "active" : ""}`} title="Search" onClick={() => onOpenPanel("NONE")}>
          <Icon name="search" />
        </button>
      </div>
    </aside>
  );
}
