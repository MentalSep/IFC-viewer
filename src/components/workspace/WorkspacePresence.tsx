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
  copy?: ViewerCopy["workspace"] | null;
}

export function WorkspacePresence({ users, copy }: WorkspacePresenceProps) {
  const safeCopy = copy ?? {
    commandPaletteTitle: "",
    commandPaletteSubtitle: "",
    expand: "",
    collapse: "",
    groupTitles: { navigation: "", visibility: "", measurements: "", actions: "" },
    searchTitle: "",
    searchSubtitle: "",
    searchPlaceholder: "",
    searchCategory: "",
    searchChipPrefix: "",
    heatmapTitle: "",
    heatmapSubtitle: "",
    heatmapModes: { none: "", cost: "", progress: "", status: "", planning: "" },
    presenceTitle: "Presence",
    presenceSubtitle: "Collaborators",
    presenceActive: "active",
    presenceStatuses: { online: "online", away: "away", typing: "typing" },
    activityTitle: "",
    activitySubtitle: "",
    activityKinds: { upload: "", comment: "", planning: "", action: "" },
    minimapTitle: "",
    minimapSubtitle: "",
    minimapFit: "Fit",
    timelineTitle: "",
    timelineSubtitle: "",
    timelinePlay: "Play",
    timelinePause: "Pause",
    timelineSpeed: "Speed",
    metricsModelTypes: "",
    metricsComments: "",
    metricsFeedItems: "",
  } as ViewerCopy["workspace"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel workspace-presence px-4 py-3"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="panel-subtitle">{safeCopy.presenceTitle}</p>
          <h3>{safeCopy.presenceSubtitle}</h3>
        </div>
        <span className="panel-badge" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.12)', color: 'rgba(167,246,208,0.9)' }}>
          <Icon name="users" /> {users.filter((user) => user.status === "online").length} {safeCopy.presenceActive}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="panel-user-card"
          >
            <div
              className="presence-avatar"
              style={{ backgroundColor: user.color }}
            >
              {user.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
              {user.status === "typing" && (
                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full" style={{ border: '1px solid rgba(0,0,0,0.6)', background: 'rgba(34,211,238,0.95)' }} />
              )}
            </div>
            <div>
              <p className="panel-username">{user.name}</p>
              <p className="panel-user-meta">{user.role} · {safeCopy.presenceStatuses[user.status]}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
