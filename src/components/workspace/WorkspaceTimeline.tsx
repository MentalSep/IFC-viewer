import { motion } from "framer-motion";
import { Icon } from "../ui/Icon";
import type { ViewerCopy } from "../../utils/viewerI18n";

interface TimelinePhase {
  id: string;
  label: string;
  description: string;
}

interface WorkspaceTimelineProps {
  phases: TimelinePhase[];
  currentPhaseIndex: number;
  progress: number;
  speed: number;
  playing: boolean;
  onTogglePlay: () => void;
  onProgressChange: (progress: number) => void;
  onSpeedChange: (speed: number) => void;
  copy: ViewerCopy["workspace"];
}

export function WorkspaceTimeline({
  phases,
  currentPhaseIndex,
  progress,
  speed,
  playing,
  onTogglePlay,
  onProgressChange,
  onSpeedChange,
  copy,
}: WorkspaceTimelineProps) {
  const currentPhase = phases[currentPhaseIndex] ?? phases[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel"
    >
      <div className="panel-header">
        <div>
          <p className="panel-subtitle">{copy.timelineTitle}</p>
          <h3>{currentPhase?.label ?? copy.timelineSubtitle}</h3>
        </div>
        <button
          type="button"
          onClick={onTogglePlay}
          className="panel-btn panel-btn-compact"
        >
          <Icon name={playing ? "pause" : "camera"} />
          {playing ? copy.timelinePause : copy.timelinePlay}
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={(e) => onProgressChange(Number(e.target.value))}
        className="panel-range"
      />

      <div className="panel-grid">
        {phases.map((phase, index) => (
          <button
            key={phase.id}
            type="button"
            onClick={() => onProgressChange((index / Math.max(1, phases.length - 1)) * 100)}
            className={`panel-pill ${index === currentPhaseIndex ? 'active' : ''}` }
          >
            {phase.label}
          </button>
        ))}
      </div>

        <div className="panel-row">
          <span className="panel-item-meta">{currentPhase?.description ?? copy.timelineSubtitle}</span>
          <label className="flex items-center gap-2">
            {copy.timelineSpeed}
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="panel-btn panel-btn-compact"
            >
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </label>
        </div>
    </motion.div>
  );
}
