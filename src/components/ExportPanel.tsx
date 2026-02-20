import { useCallback } from "react";
import type { ElementComment } from "./ElementComments";
import type { ElementTypeInfo } from "./ModelTree";

interface ExportPanelProps {
  comments: ElementComment[];
  elementTypes: ElementTypeInfo[];
  fileName: string | null;
  loadTimeMs: number | null;
}

function ExportPanel({
  comments,
  elementTypes,
  fileName,
  loadTimeMs,
}: ExportPanelProps) {
  const exportCommentsJSON = useCallback(() => {
    const data = comments.map((c) => ({
      id: c.id,
      element: `${c.elementType} #${c.expressId}`,
      author: c.author,
      role: c.role,
      priority: c.priority,
      text: c.text,
      timestamp: c.timestamp.toISOString(),
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, `${fileName ?? "model"}-comments.json`);
  }, [comments, fileName]);

  const exportCommentsCSV = useCallback(() => {
    const header = "ID,Element,Author,Role,Priority,Comment,Timestamp\n";
    const rows = comments
      .map(
        (c) =>
          `${c.id},"${c.elementType} #${c.expressId}","${c.author}","${c.role}","${c.priority}","${c.text.replace(/"/g, '""')}","${c.timestamp.toISOString()}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    downloadBlob(blob, `${fileName ?? "model"}-comments.csv`);
  }, [comments, fileName]);

  const exportReport = useCallback(() => {
    const totalElements = elementTypes.reduce((sum, el) => sum + el.count, 0);
    const criticalCount = comments.filter(
      (c) => c.priority === "critical",
    ).length;
    const warningCount = comments.filter(
      (c) => c.priority === "warning",
    ).length;

    const lines = [
      `# IFC Model Report`,
      `**File:** ${fileName ?? "N/A"}`,
      `**Generated:** ${new Date().toLocaleString()}`,
      `**Load Time:** ${loadTimeMs !== null ? `${(loadTimeMs / 1000).toFixed(1)}s` : "N/A"}`,
      ``,
      `## Model Statistics`,
      `- Total Elements: ${totalElements}`,
      `- Unique Types: ${elementTypes.length}`,
      ``,
      `### Element Breakdown`,
      ...elementTypes
        .sort((a, b) => b.count - a.count)
        .map((el) => `- ${el.type}: ${el.count}`),
      ``,
      `## Comments Summary`,
      `- Total Comments: ${comments.length}`,
      `- Critical: ${criticalCount}`,
      `- Warnings: ${warningCount}`,
      ``,
      `### All Comments`,
      ...comments.map(
        (c) =>
          `- [${c.priority.toUpperCase()}] ${c.elementType} #${c.expressId} — **${c.author}** (${c.role}): ${c.text}`,
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    downloadBlob(blob, `${fileName ?? "model"}-report.md`);
  }, [comments, elementTypes, fileName, loadTimeMs]);

  if (!fileName) return null;

  return (
    <div className="export-panel">
      <h3 className="export-title">📤 Export</h3>
      <div className="export-buttons">
        <button
          className="export-btn"
          onClick={exportCommentsJSON}
          disabled={comments.length === 0}
          title="Export comments as JSON"
        >
          💾 JSON
        </button>
        <button
          className="export-btn"
          onClick={exportCommentsCSV}
          disabled={comments.length === 0}
          title="Export comments as CSV"
        >
          📊 CSV
        </button>
        <button
          className="export-btn"
          onClick={exportReport}
          title="Export full model report as Markdown"
        >
          📝 Report
        </button>
      </div>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default ExportPanel;
