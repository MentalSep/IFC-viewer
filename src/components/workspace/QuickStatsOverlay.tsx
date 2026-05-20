import { motion } from "framer-motion";

interface QuickStatsOverlayProps {
  fileName?: string | null;
  fileSize?: string | null;
  loadTimeMs?: number | null;
  selected?: { id?: number | string; label?: string } | null;
}

export function QuickStatsOverlay({ fileName, fileSize, loadTimeMs, selected }: QuickStatsOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel quick-stats-overlay"
      style={{ width: 220 }}
    >
      <div className="panel-header">
        <div>
          <p className="panel-subtitle">Quick stats</p>
          <h3>Workspace</h3>
        </div>
      </div>

      <div className="panel-grid" style={{ marginTop: 8 }}>
        <div className="panel-list-item">
          <div className="panel-item-title">File</div>
          <div className="panel-item-meta">{fileName ?? "—"}</div>
        </div>
        <div className="panel-list-item">
          <div className="panel-item-title">Size</div>
          <div className="panel-item-meta">{fileSize ?? "—"}</div>
        </div>
        <div className="panel-list-item">
          <div className="panel-item-title">Load time</div>
          <div className="panel-item-meta">{loadTimeMs ? `${Math.round(loadTimeMs)} ms` : "—"}</div>
        </div>
        <div className="panel-list-item">
          <div className="panel-item-title">Selection</div>
          <div className="panel-item-meta">{selected?.label ?? (selected?.id ? `#${selected.id}` : "None")}</div>
        </div>
      </div>
    </motion.div>
  );
}
