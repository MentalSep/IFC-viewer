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
      className="panel floating-tool-palette pointer-events-auto"
      aria-label="Tool palette"
    >
      <div className="panel-header">
        <div>
          <p className="panel-subtitle">
            {copy.commandPaletteTitle}
          </p>
          <h3>{copy.commandPaletteSubtitle}</h3>
        </div>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="panel-btn panel-btn-compact"
        >
          {collapsed ? copy.expand : copy.collapse}
        </button>
      </div>

      {/* Compact icon-only mode when collapsed */}
      <AnimatePresence mode="wait">
        {collapsed ? (
          <motion.div
            key="palette-compact"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "64px" }}
            exit={{ opacity: 0, width: 0 }}
            className="palette-compact panel-grid"
          >
            {groups.flatMap((g) => g.actions).map((action) => (
              <div key={action.id} className="compact-action-wrap" style={{ position: 'relative' }}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  title={action.label}
                  className={`panel-compact-action ${action.active ? 'active' : ''}`}
                  aria-label={action.label}
                >
                  <Icon name={action.icon} />
                </motion.button>
                <span className="compact-tooltip" role="status" aria-hidden>{action.label}</span>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="palette-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="panel-grid"
          >
            {groups.map((group) => (
              <div key={group.title} className="panel-group">
                <p className="panel-subtitle">
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
                      className={`panel-action-btn ${action.active ? 'active' : ''}`}
                    >
                      <span className="action-icon flex h-8 w-8 items-center justify-center rounded-lg bg-white/6 text-base transition">
                        <Icon name={action.icon} />
                      </span>
                      <span className="action-label font-medium">{action.label}</span>
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
