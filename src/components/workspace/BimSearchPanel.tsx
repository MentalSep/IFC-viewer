import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../ui/Icon";
import type { ViewerCopy } from "../../utils/viewerI18n";

export interface BimSearchResult {
  id: string;
  label: string;
  category: string;
  count: number;
}

interface BimSearchPanelProps {
  value: string;
  onChange: (value: string) => void;
  results: BimSearchResult[];
  chips: string[];
  onChipClick: (value: string) => void;
  onResultClick: (id: string) => void;
  copy: ViewerCopy["workspace"];
}

export function BimSearchPanel({
  value,
  onChange,
  results,
  chips,
  onChipClick,
  onResultClick,
  copy,
}: BimSearchPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-3xl border border-white/10 bg-slate-950/75 p-4 shadow-glow backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon name="search" className="text-cyan-200" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">{copy.searchTitle}</p>
          <h3 className="text-sm font-semibold text-slate-100">{copy.searchSubtitle}</h3>
        </div>
      </div>

      <div className="relative">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={copy.searchPlaceholder}
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/8"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onChipClick(chip)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-100"
          >
            {copy.searchChipPrefix}
            {chip}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-2">
        <AnimatePresence>
          {results.map((result) => (
            <motion.button
              key={result.id}
              layout
              type="button"
              onClick={() => onResultClick(result.id)}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:border-cyan-400/30 hover:bg-white/8"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-100">{result.label}</p>
                  <p className="text-xs text-slate-400">{result.category}</p>
                </div>
                <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-xs text-cyan-100">
                  {result.count}
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
