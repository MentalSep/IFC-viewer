import { motion } from "framer-motion";
import { Icon } from "../ui/Icon";

interface ActiveToolIndicatorProps {
  tools: { [key: string]: boolean };
}

export function ActiveToolIndicator({ tools }: ActiveToolIndicatorProps) {
  const active = Object.keys(tools).filter((k) => tools[k]);
  if (active.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="panel active-tool-indicator"
      style={{ width: 200 }}
    >
      <div className="panel-header">
        <div>
          <p className="panel-subtitle">Active tool</p>
          <h3>Tool</h3>
        </div>
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {active.map((name) => (
          <button key={name} type="button" className="panel-pill" style={{ fontSize: 13 }}>
            <Icon name={name as any} /> {name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
