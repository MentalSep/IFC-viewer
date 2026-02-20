import type { ElementTypeInfo } from "./ModelTree";
import type { ElementComment } from "./ElementComments";

interface ModelStatsProps {
  fileName: string | null;
  fileSize: string | null;
  elementTypes: ElementTypeInfo[];
  loadTimeMs: number | null;
  commentCount: number;
  comments: ElementComment[];
}

function ModelStats({
  fileName,
  fileSize,
  elementTypes,
  loadTimeMs,
  commentCount,
  comments,
}: ModelStatsProps) {
  if (!fileName) return null;

  const totalElements = elementTypes.reduce((sum, el) => sum + el.count, 0);
  const uniqueTypes = elementTypes.length;

  const criticalCount = comments.filter(
    (c) => c.priority === "critical",
  ).length;
  const warningCount = comments.filter((c) => c.priority === "warning").length;

  return (
    <div className="model-stats">
      <h3 className="model-stats-title">📊 Model Info</h3>
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
      {commentCount > 0 && (
        <div className="model-stats-comments">
          <span>
            💬 {commentCount} comment{commentCount !== 1 ? "s" : ""}
          </span>
          {criticalCount > 0 && (
            <span className="model-stats-critical">🚨 {criticalCount}</span>
          )}
          {warningCount > 0 && (
            <span className="model-stats-warning">⚠️ {warningCount}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default ModelStats;
