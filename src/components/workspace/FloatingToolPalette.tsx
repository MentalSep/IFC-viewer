import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "../ui/Icon";
import type { ViewerCopy } from "../../utils/viewerI18n";

interface ToolAction {
  id: string;
  label: string;
  icon: IconName;
  active?: boolean;
  onClick: () => void;
}

interface ToolGroup {
  title: string;
  actions: ToolAction[];
}

interface FloatingToolPaletteProps {
  groups: ToolGroup[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
  copy: ViewerCopy["workspace"];
}

export function FloatingToolPalette({
  groups,
  collapsed,
  onToggleCollapsed,
  copy,
}: FloatingToolPaletteProps) {
  return (
    <motion.div
      layout
      drag
      dragMomentum={false}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileDrag={{ scale: 1.01, opacity: 0.98 }}
      className="pointer-events-auto rounded-3xl border border-white/10 bg-slate-950/75 p-3 shadow-glow backdrop-blur-xl"
      aria-label="Tool palette"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">
            {copy.commandPaletteTitle}
          </p>
          <h3 className="text-sm font-semibold text-slate-100">{copy.commandPaletteSubtitle}</h3>
        </div>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10"
        >
          {collapsed ? copy.expand : copy.collapse}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            key="palette-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 grid gap-3"
          >
            {groups.map((group) => (
              <div key={group.title} className="rounded-2xl border border-white/8 bg-white/5 p-2">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                  {group.title}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {group.actions.map((action) => (
                    <motion.button
                      key={action.id}
                      type="button"
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.onClick}
                      title={action.label}
                      className={`group flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition ${
                        action.active
                          ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-100"
                          : "border-white/10 bg-slate-900/50 text-slate-200 hover:border-cyan-400/30 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/8 text-base transition group-hover:bg-white/12">
                        <Icon name={action.icon} />
                      </span>
                      <span className="font-medium">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
