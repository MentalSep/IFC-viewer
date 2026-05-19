import { motion } from "framer-motion";
import { Icon } from "../ui/Icon";
import type { ViewerCopy } from "../../utils/viewerI18n";

interface PresenceUser {
  id: string;
  name: string;
  role: string;
  status: "online" | "away" | "typing";
  color: string;
}

interface WorkspacePresenceProps {
  users: PresenceUser[];
  copy: ViewerCopy["workspace"];
}

export function WorkspacePresence({ users, copy }: WorkspacePresenceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-slate-950/75 px-4 py-3 shadow-glow backdrop-blur-xl"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">{copy.presenceTitle}</p>
          <h3 className="text-sm font-semibold text-slate-100">{copy.presenceSubtitle}</h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
          <Icon name="users" /> {users.filter((user) => user.status === "online").length} {copy.presenceActive}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <div
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-slate-950"
              style={{ backgroundColor: user.color }}
            >
              {user.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
              {user.status === "typing" && (
                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-slate-950 bg-cyan-300" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">{user.name}</p>
              <p className="text-xs text-slate-400">
                {user.role} · {copy.presenceStatuses[user.status]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
