import type { ElementTypeInfo } from "./ModelTree";

interface ModelStatsProps {
  fileName: string | null;
  fileSize: string | null;
  elementTypes: ElementTypeInfo[];
  loadTimeMs: number | null;
  labels?: {
    title: string;
    elements: string;
    types: string;
    size: string;
    loadTime: string;
    empty: string;
  };
}

function ModelStats({
  fileName,
  fileSize,
  elementTypes,
  loadTimeMs,
  labels,
}: ModelStatsProps) {
  if (!fileName) return null;

  const totalElements = elementTypes.reduce((sum, el) => sum + el.count, 0);
  const uniqueTypes = elementTypes.length;
  const copy = labels ?? {
    title: "Model Info",
    elements: "Elements",
    types: "Types",
    size: "Size",
    loadTime: "Load Time",
    empty: "No elements",
  };

  return (
    <div className="model-stats">
      <h3 className="model-stats-title">{copy.title}</h3>
      <div className="model-stats-grid">
        <div className="model-stat">
          <span className="model-stat-value">{totalElements}</span>
          <span className="model-stat-label">{copy.elements}</span>
        </div>
        <div className="model-stat">
          <span className="model-stat-value">{uniqueTypes}</span>
          <span className="model-stat-label">{copy.types}</span>
        </div>
        <div className="model-stat">
          <span className="model-stat-value">{fileSize ?? "—"}</span>
          <span className="model-stat-label">{copy.size}</span>
        </div>
        <div className="model-stat">
          <span className="model-stat-value">
            {loadTimeMs !== null ? `${(loadTimeMs / 1000).toFixed(1)}s` : "—"}
          </span>
          <span className="model-stat-label">{copy.loadTime}</span>
        </div>
      </div>
    </div>
  );
}

export default ModelStats;
