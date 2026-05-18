import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { Icon, type IconName } from "./ui/Icon";
import { useAppLanguage } from "./AppLanguage";

export type ProfessionalRole =
  | "Architect"
  | "Electrician"
  | "Plumber"
  | "Structural Engineer"
  | "HVAC Engineer"
  | "Project Manager"
  | "Fire Safety"
  | "Interior Designer";

export const ROLES: ProfessionalRole[] = [
  "Architect",
  "Electrician",
  "Plumber",
  "Structural Engineer",
  "HVAC Engineer",
  "Project Manager",
  "Fire Safety",
  "Interior Designer",
];

export const ROLE_META: Record<
  ProfessionalRole,
  { icon: IconName; color: string }
> = {
  Architect: { icon: "drafting", color: "#38bdf8" },
  Electrician: { icon: "bolt", color: "#facc15" },
  Plumber: { icon: "wrench", color: "#60a5fa" },
  "Structural Engineer": { icon: "building", color: "#f97316" },
  "HVAC Engineer": { icon: "snow", color: "#a78bfa" },
  "Project Manager": { icon: "clipboard", color: "#fb923c" },
  "Fire Safety": { icon: "flame", color: "#ef4444" },
  "Interior Designer": { icon: "palette", color: "#f472b6" },
};

export interface ElementComment {
  id: string;
  expressId: number;
  elementType: string;
  author: string;
  role: ProfessionalRole;
  text: string;
  timestamp: Date;
  priority: "info" | "warning" | "critical";
}

export type ElementCommentDraft = Omit<ElementComment, "id" | "timestamp">;

interface ElementCommentsProps {
  /** Currently selected element expressId, or null */
  selectedExpressId: number | null;
  selectedElementType: string | null;
  /** All comments across all elements */
  comments: ElementComment[];
  onAddComment: (comment: ElementCommentDraft) => void;
  userName: string;
  userRole: ProfessionalRole;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function friendlyType(type: string): string {
  let name = type.startsWith("Ifc") ? type.slice(3) : type;
  name = name.replace(/([a-z])([A-Z])/g, "$1 $2");
  return name;
}

const PRIORITY_LABELS = {
  info: { icon: "info" as IconName },
  warning: { icon: "warning" as IconName },
  critical: { icon: "critical" as IconName },
};

function ElementComments({
  selectedExpressId,
  selectedElementType,
  comments,
  onAddComment,
  userName,
  userRole,
}: ElementCommentsProps) {
  const { copy } = useAppLanguage();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<"info" | "warning" | "critical">(
    "info",
  );
  const [filterMode, setFilterMode] = useState<"element" | "all">("element");
  const listEndRef = useRef<HTMLDivElement>(null);
  const filtered =
    filterMode === "element" && selectedExpressId !== null
      ? comments.filter((c) => c.expressId === selectedExpressId)
      : comments;

  // auto-scroll
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filtered.length]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed || selectedExpressId === null) return;

      onAddComment({
        expressId: selectedExpressId,
        elementType: selectedElementType ?? "Unknown",
        author: userName,
        role: userRole,
        text: trimmed,
        priority,
      });
      setText("");
    },
    [
      text,
      selectedExpressId,
      selectedElementType,
      userName,
      userRole,
      priority,
      onAddComment,
    ],
  );

  return (
    <div className="elem-comments">
      <div className="elem-comments-header">
        <h3 className="elem-comments-title">{copy.comments.title}</h3>
        <div className="elem-comments-tabs">
          <button
            className={`elem-tab${filterMode === "element" ? " active" : ""}`}
            onClick={() => setFilterMode("element")}
          >
            {copy.comments.tabElement}
          </button>
          <button
            className={`elem-tab${filterMode === "all" ? " active" : ""}`}
            onClick={() => setFilterMode("all")}
          >
            {copy.comments.tabAll} ({comments.length})
          </button>
        </div>
      </div>

      {filterMode === "element" && selectedExpressId !== null && (
        <div className="elem-comments-target">
          <span className="elem-comments-target-type">
            {friendlyType(selectedElementType ?? "Element")}
          </span>
          <span className="elem-comments-target-id">#{selectedExpressId}</span>
        </div>
      )}

      <div className="elem-comments-list">
        {filtered.length === 0 && (
          <p className="elem-comments-empty">
            {selectedExpressId === null
              ? copy.comments.selectElementPrompt
              : copy.comments.noCommentsOnElement}
          </p>
        )}
        {filtered.map((c) => {
          const meta = ROLE_META[c.role];
          return (
            <div
              key={c.id}
              className={`elem-comment elem-comment--${c.priority}`}
            >
              <div className="elem-comment-top">
                <span
                  className="elem-comment-role-badge"
                  style={{
                    color: meta.color,
                    borderColor: meta.color,
                    background: `${meta.color}15`,
                  }}
                >
                  <Icon name={meta.icon} /> {c.role}
                </span>
                <span className="elem-comment-pri">
                  <Icon name={PRIORITY_LABELS[c.priority].icon} />
                </span>
              </div>
              <div className="elem-comment-body">
                <span className="elem-comment-author">{c.author}</span>
                {filterMode === "all" && (
                  <span className="elem-comment-el-tag">
                    {friendlyType(c.elementType)} #{c.expressId}
                  </span>
                )}
                <p className="elem-comment-text">{c.text}</p>
              </div>
              <span className="elem-comment-time">
                {formatTime(c.timestamp)}
              </span>
            </div>
          );
        })}
        <div ref={listEndRef} />
      </div>

      {/* Comment input — only if element is selected */}
      {selectedExpressId !== null && (
        <form className="elem-comment-form" onSubmit={handleSubmit}>
          <div className="elem-comment-form-row">
            <select
              className="elem-priority-select"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "info" | "warning" | "critical")
              }
            >
              <option value="info">{copy.comments.info}</option>
              <option value="warning">{copy.comments.warning}</option>
              <option value="critical">{copy.comments.critical}</option>
            </select>
          </div>
          <div className="elem-comment-form-input">
            <input
              className="chat-input"
              type="text"
              placeholder={`${copy.comments.commentAs} ${userRole}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!text.trim()}
            >
              <Icon name="send" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ElementComments;
