import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../ui/Icon";
import type { ViewerCopy } from "../../utils/viewerI18n";

export interface WorkspaceActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  kind: "upload" | "comment" | "planning" | "action";
}

interface WorkspaceActivityFeedProps {
  items: WorkspaceActivityItem[];
  copy: ViewerCopy["workspace"];
}

const badgeStyles: Record<WorkspaceActivityItem["kind"], string> = {
  upload: "bg-sky-400/15 text-sky-200",
  comment: "bg-fuchsia-400/15 text-fuchsia-200",
  planning: "bg-amber-400/15 text-amber-200",
  action: "bg-emerald-400/15 text-emerald-200",
};

export function WorkspaceActivityFeed({ items, copy }: WorkspaceActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-3xl border border-white/10 bg-slate-950/75 p-4 shadow-glow backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">{copy.activityTitle}</p>
          <h3 className="text-sm font-semibold text-slate-100">{copy.activitySubtitle}</h3>
        </div>
        <Icon name="bolt" className="text-cyan-200" />
      </div>

      <div className="grid gap-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${badgeStyles[item.kind]}`}>
                  {copy.activityKinds[item.kind]}
                </span>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
              <p className="text-sm font-medium text-slate-100">{item.title}</p>
              <p className="mt-1 text-xs text-slate-400">{item.subtitle}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
