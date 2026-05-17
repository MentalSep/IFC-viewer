import type { ElementTypeInfo } from "./ModelTree";

interface ModelStatsProps {
  fileName: string | null;
  fileSize: string | null;
  elementTypes: ElementTypeInfo[];
  loadTimeMs: number | null;
}

function ModelStats({
  fileName,
  fileSize,
  elementTypes,
  loadTimeMs,
}: ModelStatsProps) {
  if (!fileName) return null;

  const totalElements = elementTypes.reduce((sum, el) => sum + el.count, 0);
  const uniqueTypes = elementTypes.length;

  return (
    <div className="model-stats">
      <h3 className="model-stats-title">Model Info</h3>
      <div className="model-stats-grid">
        <div className="model-stat">
          <span className="model-stat-value">{totalElements}</span>
          <span className="model-stat-label">Elements</span>
        </div>
        <div className="model-stat">
          <span className="model-stat-value">{uniqueTypes}</span>
          <span className="model-stat-label">Types</span>
        </div>
        <div className="model-stat">
          <span className="model-stat-value">{fileSize ?? "—"}</span>
          <span className="model-stat-label">Size</span>
        </div>
        <div className="model-stat">
          <span className="model-stat-value">
            {loadTimeMs !== null ? `${(loadTimeMs / 1000).toFixed(1)}s` : "—"}
          </span>
          <span className="model-stat-label">Load Time</span>
        </div>
      </div>
    </div>
  );
}

export default ModelStats;
