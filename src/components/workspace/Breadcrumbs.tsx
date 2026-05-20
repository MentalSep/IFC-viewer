import { motion } from "framer-motion";

interface BreadcrumbsProps {
  path: string[];
}

export function Breadcrumbs({ path }: BreadcrumbsProps) {
  if (!path || !path.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="panel breadcrumbs" style={{ width: 360 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {path.map((p, i) => (
          <span key={i} className={`panel-pill ${i === path.length - 1 ? "active" : ""}`}>
            {p}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
