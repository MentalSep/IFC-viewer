import {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent,
  KeyboardEvent,
} from "react";
import { ROLES, ROLE_META, type ProfessionalRole } from "./ElementComments";
import { Icon } from "./ui/Icon";
import { useAppLanguage } from "./AppLanguage";

export interface ChatMessage {
  id: string;
  author: string;
  role: ProfessionalRole;
  text: string;
  timestamp: Date;
}

interface ChatProps {
  fileName: string | null;
  /** Called once the user sets their name + role */
  onUserReady?: (name: string, role: ProfessionalRole) => void;
  messages?: ChatMessage[];
  onSendMessage?: (
    text: string,
    author: string,
    role: ProfessionalRole,
  ) => Promise<void> | void;
  initialUserName?: string;
  initialRole?: ProfessionalRole;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Chat({
  fileName,
  onUserReady,
  messages: externalMessages,
  onSendMessage,
  initialUserName,
  initialRole = "Architect",
}: ChatProps) {
  const { copy } = useAppLanguage();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState(initialUserName ?? "");
  const [role, setRole] = useState<ProfessionalRole>(initialRole);
  const [joined, setJoined] = useState(Boolean(initialUserName));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeMessages = externalMessages ?? localMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  useEffect(() => {
    if (joined) inputRef.current?.focus();
  }, [joined]);

  useEffect(() => {
    if (initialUserName) {
      setUsername(initialUserName);
      setJoined(true);
    }
  }, [initialUserName]);

  const handleJoin = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = username.trim();
      if (trimmed.length === 0) return;
      setUsername(trimmed);
      setJoined(true);
      onUserReady?.(trimmed, role);
    },
    [username, role, onUserReady],
  );

  const sendMessage = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || !joined) return;
      if (onSendMessage) {
        void onSendMessage(text, username, role);
      } else {
        setLocalMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            author: username,
            role,
            text,
            timestamp: new Date(),
          },
        ]);
      }
      setInput("");
    },
    [input, username, role, joined, onSendMessage],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(e as unknown as FormEvent);
      }
    },
    [sendMessage],
  );

  // ── Join form ──
  if (!joined) {
      return (
        <aside className="panel chat-panel">
        <h2 className="chat-title">{copy.chat.title}</h2>
        {fileName ? (
          <div className="chat-file-badge">
            <span className="chat-file-dot" />
            {fileName}
          </div>
        ) : (
          <div className="chat-file-badge">
          <span className="chat-file-dot" />
            {copy.chat.projectChannel}
          </div>
        )}
        <form className="chat-username-form" onSubmit={handleJoin}>
          <label htmlFor="chat-name">{copy.chat.yourName}</label>
          <input
            id="chat-name"
            className="chat-input"
            type="text"
            placeholder={copy.chat.namePlaceholder}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={24}
            autoFocus
          />
          <label htmlFor="chat-role">{copy.chat.yourRole}</label>
          <select
            id="chat-role"
            className="chat-role-select"
            value={role}
            onChange={(e) => setRole(e.target.value as ProfessionalRole)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_META[r].icon} {r}
              </option>
            ))}
          </select>
          <button type="submit" className="button primary chat-join-btn">
            {copy.chat.join}
          </button>
        </form>
      </aside>
    );
  }

  // ── Chat view ──
  const myMeta = ROLE_META[role];

  return (
    <aside className="panel chat-panel">
      <h2 className="chat-title">{copy.chat.title}</h2>
      <div className="chat-file-badge">
        <span className="chat-file-dot" />
        {fileName ?? copy.chat.projectChannel}
      </div>

      {/* User info */}
      <div className="chat-user-info">
        <span
          className="chat-user-role-badge"
          style={{
            color: myMeta.color,
            borderColor: myMeta.color,
            background: `${myMeta.color}15`,
          }}
        >
          {myMeta.icon} {role}
        </span>
        <span className="chat-user-name">{username}</span>
      </div>

      <div className="chat-messages">
        {activeMessages.length === 0 && (
          <p className="chat-placeholder">
            {copy.chat.noMessages} <strong>{fileName ?? copy.chat.projectChannel}</strong>!
          </p>
        )}
        {activeMessages.map((msg) => {
          const meta = ROLE_META[msg.role];
          return (
            <div key={msg.id} className="chat-message">
              <div className="chat-message-header">
                <div className="chat-message-author-row">
                  <span
                    className="chat-msg-role-badge"
                    style={{
                      color: meta.color,
                      borderColor: meta.color,
                      background: `${meta.color}15`,
                    }}
                  >
                    {meta.icon}
                  </span>
                  <span className="chat-author" style={{ color: meta.color }}>
                    {msg.author}
                  </span>
                </div>
                <span className="chat-time">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="chat-text">{msg.text}</p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-form" onSubmit={sendMessage}>
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder={`${copy.chat.messageAs} ${role}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!input.trim()}
        >
          <Icon name="send" />
        </button>
      </form>
    </aside>
  );
}

export default Chat;
