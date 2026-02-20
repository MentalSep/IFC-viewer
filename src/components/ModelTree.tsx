import { useState } from "react";

export interface ElementTypeInfo {
  type: string;
  count: number;
}

interface ModelTreeProps {
  elements: ElementTypeInfo[];
  onElementTypeClick: (type: string) => void;
}

const TYPE_ICONS: Record<string, string> = {
  IFCWALL: "🧱",
  IFCWALLSTANDARDCASE: "🧱",
  IFCSLAB: "⬜",
  IFCCOLUMN: "🏛️",
  IFCBEAM: "📏",
  IFCDOOR: "🚪",
  IFCWINDOW: "🪟",
  IFCROOF: "🏠",
  IFCSTAIR: "🪜",
  IFCSTAIRFLIGHT: "🪜",
  IFCRAILING: "🔩",
  IFCFURNISHINGELEMENT: "🪑",
  IFCBUILDINGELEMENTPROXY: "📦",
  IFCPLATE: "🔲",
  IFCMEMBER: "🔗",
  IFCCOVERING: "🎨",
  IFCFOOTING: "⚓",
  IFCCURTAINWALL: "🏢",
  IFCSPACE: "📐",
  IFCOPENINGELEMENT: "⭕",
  IFCFLOWSEGMENT: "🔧",
  IFCFLOWTERMINAL: "🔧",
  IFCDISTRIBUTIONELEMENT: "⚙️",
};

function getIcon(type: string): string {
  const upper = type.toUpperCase();
  return TYPE_ICONS[upper] ?? "🔹";
}

function friendlyName(type: string): string {
  // Strip "Ifc" prefix and add spaces before capitals
  let name = type.startsWith("Ifc") ? type.slice(3) : type;
  name = name.replace(/([a-z])([A-Z])/g, "$1 $2");
  return name;
}

function ModelTree({ elements, onElementTypeClick }: ModelTreeProps) {
  const [expanded, setExpanded] = useState(true);

  const totalCount = elements.reduce((sum, el) => sum + el.count, 0);
  const sorted = [...elements].sort((a, b) => b.count - a.count);

  if (elements.length === 0) {
    return (
      <div className="model-tree">
        <div
          className="model-tree-header"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="model-tree-chevron">{expanded ? "▾" : "▸"}</span>
          <span className="model-tree-title">Model Elements</span>
        </div>
        {expanded && <p className="model-tree-empty">No model loaded</p>}
      </div>
    );
  }

  return (
    <div className="model-tree">
      <div className="model-tree-header" onClick={() => setExpanded(!expanded)}>
        <span className="model-tree-chevron">{expanded ? "▾" : "▸"}</span>
        <span className="model-tree-title">Model Elements</span>
        <span className="model-tree-count">{totalCount}</span>
      </div>
      {expanded && (
        <ul className="model-tree-list">
          {sorted.map((el) => (
            <li
              key={el.type}
              className="model-tree-item"
              onClick={() => onElementTypeClick(el.type)}
            >
              <span className="model-tree-icon">{getIcon(el.type)}</span>
              <span className="model-tree-name">{friendlyName(el.type)}</span>
              <span className="model-tree-badge">{el.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ModelTree;
