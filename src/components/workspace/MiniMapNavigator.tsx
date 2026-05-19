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
  copy: ViewerCopy["workspace"];
}

export function MiniMapNavigator({
  floors,
  activeFloor,
  onFloorChange,
  onFitView,
  copy,
}: MiniMapNavigatorProps) {
  const activeIndex = Math.max(
    0,
    floors.findIndex((floor) => floor.id === activeFloor),
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="pointer-events-auto w-72 rounded-3xl border border-white/10 bg-slate-950/75 p-4 shadow-glow backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">{copy.minimapTitle}</p>
          <h3 className="text-sm font-semibold text-slate-100">{copy.minimapSubtitle}</h3>
        </div>
        <button
          type="button"
          onClick={onFitView}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10"
        >
          <Icon name="eye" className="mr-1 inline-block" />
          {copy.minimapFit}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-fuchsia-500/10 p-4">
        <div className="grid grid-cols-6 gap-2 opacity-70">
          {Array.from({ length: 30 }).map((_, idx) => (
            <span key={idx} className="h-2 rounded-full bg-white/5" />
          ))}
        </div>
        <motion.div
          animate={{ top: `${18 + activeIndex * 16}%`, left: `${28 + activeIndex * 10}%` }}
          className="absolute h-4 w-4 rounded-full border border-white/50 bg-cyan-300 shadow-[0_0_0_8px_rgba(34,211,238,0.12)]"
        />
      </div>

      <div className="mt-3 grid gap-2">
        {floors.map((floor, idx) => (
          <button
            key={floor.id}
            type="button"
            onClick={() => onFloorChange(floor.id)}
            className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-left text-xs transition ${
              floor.id === activeFloor
                ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-100"
                : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            <span className="font-medium">
              {idx + 1}. {floor.label}
            </span>
            <span className="text-slate-400">{floor.elevation}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
