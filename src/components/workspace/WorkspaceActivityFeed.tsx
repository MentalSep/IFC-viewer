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
      className="panel"
    >
      <div className="panel-header">
        <div>
          <p className="panel-subtitle">{copy.activityTitle}</p>
          <h3>{copy.activitySubtitle}</h3>
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
              className="panel-list-item"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`panel-badge ${badgeStyles[item.kind]}`}>{copy.activityKinds[item.kind]}</span>
                <span className="panel-item-meta">{item.time}</span>
              </div>
              <p className="panel-item-title">{item.title}</p>
              <p className="mt-1 panel-item-meta">{item.subtitle}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
