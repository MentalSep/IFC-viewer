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
      className="panel"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon name="search" className="text-cyan-200" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">{copy.searchTitle}</p>
          <h3>{copy.searchSubtitle}</h3>
        </div>
      </div>

      <div className="relative">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={copy.searchPlaceholder}
          className="panel-input"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onChipClick(chip)}
            className="panel-chip"
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
              className="panel-list-item"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="panel-item-title">{result.label}</p>
                  <p className="panel-item-meta">{result.category}</p>
                </div>
                <span className="panel-badge" style={{ background: 'rgba(34,211,238,0.08)', color: 'rgba(6,182,212,0.95)' }}>{result.count}</span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
