import { motion } from "framer-motion";
import { Icon } from "../ui/Icon";
import type { ViewerCopy } from "../../utils/viewerI18n";

interface FloorLevel {
  id: string;
  label: string;
  elevation: string;
}

interface MiniMapNavigatorProps {
  floors: FloorLevel[];
  activeFloor: string;
  onFloorChange: (floorId: string) => void;
  onFitView: () => void;
  compact: boolean;
  onToggleCompact: () => void;
  copy: ViewerCopy["workspace"];
  camera?: { position: { x: number; y: number; z: number }; target?: { x: number; y: number; z: number } } | null;
}

export function MiniMapNavigator({
  floors,
  activeFloor,
  onFloorChange,
  onFitView,
  compact,
  onToggleCompact,
  copy,
  camera = null,
}: MiniMapNavigatorProps) {
  const activeIndex = Math.max(0, floors.findIndex((floor) => floor.id === activeFloor));

  const mapCameraToPercent = () => {
    if (!camera) return { left: 40, top: 28 };
    const x = camera.position.x;
    const z = camera.position.z;
    const lx = Math.max(-50, Math.min(50, x));
    const lz = Math.max(-50, Math.min(50, z));
    const left = 50 + (lx / 100) * 60;
    const top = 50 - (lz / 100) * 60;
    return { left: Math.max(8, Math.min(88, left)), top: Math.max(8, Math.min(88, top)) };
  };

  const camPct = mapCameraToPercent();

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="panel minimap-navigator minimap-navigator-compact pointer-events-auto"
      >
        <button type="button" onClick={onToggleCompact} className="minimap-compact-button">
          <span className="minimap-compact-button-top">
            <Icon name="map" className="inline-block" />
            <span>{floors[activeIndex]?.label ?? "Map"}</span>
          </span>
          <span className="minimap-compact-button-bottom">
            {camera ? `X ${camera.position.x.toFixed(0)} • Z ${camera.position.z.toFixed(0)}` : "Open minimap"}
          </span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="panel minimap-navigator pointer-events-auto"
    >
      <div className="panel-header">
        <div>
          <p className="panel-subtitle">{copy.minimapTitle}</p>
          <h3>{copy.minimapSubtitle}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onToggleCompact} className="panel-btn panel-btn-compact minimap-toggle">
            <Icon name="map" className="mr-1 inline-block" />
            Minimap
          </button>
          <button type="button" onClick={onFitView} className="panel-btn panel-btn-compact">
            <Icon name="eye" className="mr-1 inline-block" />
            {copy.minimapFit}
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden minimap-canvas">
        <div className="panel-grid minimap-dots" aria-hidden>
          {Array.from({ length: 30 }).map((_, idx) => (
            <span key={idx} className="minimap-dot" />
          ))}
        </div>
        <motion.div
          animate={{ top: `${camPct.top}%`, left: `${camPct.left}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="minimap-camera-dot"
          aria-label="Camera position"
        />
      </div>

      <div className="minimap-scroll">
        <div className="minimap-stats panel-grid" style={{ marginTop: 12 }}>
          <div className="panel-list-item">
            <div className="panel-item-title">{copy.minimapFloorLabel ?? "Floor"}</div>
            <div className="panel-item-meta">
              {floors[activeIndex]?.label ?? "—"} • {floors[activeIndex]?.elevation ?? ""}
            </div>
          </div>
          <div className="panel-list-item">
            <div className="panel-item-title">Camera</div>
            <div className="panel-item-meta">
              X: {camera?.position.x ? camera.position.x.toFixed(1) : "—"} Z:{" "}
              {camera?.position.z ? camera.position.z.toFixed(1) : "—"}
            </div>
          </div>
          <div className="panel-list-item">
            <div className="panel-item-title">Distance</div>
            <div className="panel-item-meta">
              {camera ? Math.hypot(camera.position.x, camera.position.y, camera.position.z).toFixed(1) + " m" : "—"}
            </div>
          </div>
          <div className="panel-list-item">
            <div className="panel-item-title">Target</div>
            <div className="panel-item-meta">
              {camera?.target ? `X: ${camera.target.x.toFixed(1)} Z: ${camera.target.z.toFixed(1)}` : "—"}
            </div>
          </div>
        </div>

        <div className="panel-grid minimap-floor-list" style={{ marginTop: 12 }}>
          {floors.map((floor, idx) => (
            <button
              key={floor.id}
              type="button"
              onClick={() => onFloorChange(floor.id)}
              className={`panel-list-item ${floor.id === activeFloor ? "active" : ""}`}
            >
              <span className="font-medium">
                {idx + 1}. {floor.label}
              </span>
              <span className="panel-item-meta">{floor.elevation}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
