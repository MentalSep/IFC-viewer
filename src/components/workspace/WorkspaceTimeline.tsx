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
      className="rounded-3xl border border-white/10 bg-slate-950/75 p-4 shadow-glow backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">{copy.timelineTitle}</p>
          <h3 className="text-sm font-semibold text-slate-100">
            {currentPhase?.label ?? copy.timelineSubtitle}
          </h3>
        </div>
        <button
          type="button"
          onClick={onTogglePlay}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10"
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
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {phases.map((phase, index) => (
          <button
            key={phase.id}
            type="button"
            onClick={() => onProgressChange((index / Math.max(1, phases.length - 1)) * 100)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              index === currentPhaseIndex
                ? "bg-cyan-400/20 text-cyan-100"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {phase.label}
          </button>
        ))}
      </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
        <span>{currentPhase?.description ?? copy.timelineSubtitle}</span>
        <label className="flex items-center gap-2">
          {copy.timelineSpeed}
          <select
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200"
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
