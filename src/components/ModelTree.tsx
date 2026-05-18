import { useState } from "react";

export interface ElementTypeInfo {
  type: string;
  count: number;
}

interface ModelTreeProps {
  elements: ElementTypeInfo[];
  onElementTypeClick: (type: string) => void;
  labels?: {
    title: string;
    empty: string;
  };
}

const TYPE_ICONS: Record<string, string> = {
  IFCWALL: "WL",
  IFCWALLSTANDARDCASE: "WL",
  IFCSLAB: "SL",
  IFCCOLUMN: "CL",
  IFCBEAM: "BM",
  IFCDOOR: "DR",
  IFCWINDOW: "WN",
  IFCROOF: "RF",
  IFCSTAIR: "ST",
  IFCSTAIRFLIGHT: "SF",
  IFCRAILING: "RL",
  IFCFURNISHINGELEMENT: "FR",
  IFCBUILDINGELEMENTPROXY: "PX",
  IFCPLATE: "PT",
  IFCMEMBER: "MB",
  IFCCOVERING: "CV",
  IFCFOOTING: "FT",
  IFCCURTAINWALL: "CW",
  IFCSPACE: "SP",
  IFCOPENINGELEMENT: "OP",
  IFCFLOWSEGMENT: "FS",
  IFCFLOWTERMINAL: "FT",
  IFCDISTRIBUTIONELEMENT: "DE",
};

function getIcon(type: string): string {
  const upper = type.toUpperCase();
  return TYPE_ICONS[upper] ?? "EL";
}

function friendlyName(type: string): string {
  // Strip "Ifc" prefix and add spaces before capitals
  let name = type.startsWith("Ifc") ? type.slice(3) : type;
  name = name.replace(/([a-z])([A-Z])/g, "$1 $2");
  return name;
}

function ModelTree({ elements, onElementTypeClick, labels }: ModelTreeProps) {
  const [expanded, setExpanded] = useState(true);
  const copy = labels ?? { title: "Model Elements", empty: "No model loaded" };

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
          <span className="model-tree-title">{copy.title}</span>
        </div>
        {expanded && <p className="model-tree-empty">{copy.empty}</p>}
      </div>
    );
  }

  return (
    <div className="model-tree">
      <div className="model-tree-header" onClick={() => setExpanded(!expanded)}>
        <span className="model-tree-chevron">{expanded ? "▾" : "▸"}</span>
        <span className="model-tree-title">{copy.title}</span>
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
