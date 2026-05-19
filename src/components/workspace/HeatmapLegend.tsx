import { motion } from "framer-motion";
import type { ViewerCopy } from "../../utils/viewerI18n";

export type HeatmapMode = "none" | "cost" | "progress" | "status" | "planning";

interface HeatmapLegendProps {
  mode: HeatmapMode;
  onModeChange: (mode: HeatmapMode) => void;
  copy: ViewerCopy["workspace"];
}

const MODES: { id: HeatmapMode; colors: string[] }[] = [
  { id: "none", colors: ["#3b82f6", "#22c55e"] },
  { id: "cost", colors: ["#22c55e", "#f59e0b", "#ef4444"] },
  { id: "progress", colors: ["#0ea5e9", "#a855f7", "#f43f5e"] },
  { id: "status", colors: ["#22c55e", "#eab308", "#f97316"] },
  { id: "planning", colors: ["#38bdf8", "#8b5cf6", "#f97316"] },
];

export function HeatmapLegend({ mode, onModeChange, copy }: HeatmapLegendProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-slate-950/75 p-4 shadow-glow backdrop-blur-xl"
    >
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">{copy.heatmapTitle}</p>
        <h3 className="text-sm font-semibold text-slate-100">{copy.heatmapSubtitle}</h3>
      </div>
      <div className="grid gap-2">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onModeChange(item.id)}
            className={`rounded-2xl border px-3 py-2 text-left text-xs transition ${
              mode === item.id
                ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-100"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/8"
            }`}
          >
            <span className="mb-2 block font-medium">{copy.heatmapModes[item.id]}</span>
            <span className="flex h-2 overflow-hidden rounded-full">
              {item.colors.map((color) => (
                <span key={color} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
