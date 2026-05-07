import React, { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../services/state/useAuthStore";
import apiClient from "../services/api/client";
import "../styles/pages/teams.css";

// ─── Types ───────────────────────────────────────────────────────────────────
interface User { id: string; name: string; email: string; role: string; }
interface Message {
  id: string; senderId: string; receiverId: string;
  content: string; createdAt: string; isRead: boolean;
  type: "text" | "file" | "call_missed" | "call_ended";
  fileName?: string; fileUrl?: string; fileSize?: number;
}
interface Notif { senderId: string; senderName: string; content: string; id: number; }
interface AIMessage { role: "user" | "assistant"; content: string; id: number; }
type CallState = "idle" | "calling" | "receiving" | "in-call";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin", bim_manager: "BIM", designer: "Designer",
  contractor: "Contractor", client: "Client", member: "Member",
};
const AI_CONTACT: User = { id: "__ai__", name: "Assistant BIM", email: "", role: "ai" };

// ─── Ringtone ─────────────────────────────────────────────────────────────────
function useRingtone() {
  const ctxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playRing = useCallback(() => {
    try {
      ctxRef.current = new AudioContext();
      let count = 0;
      const ring = () => {
        if (!ctxRef.current || count > 20) return;
        const osc = ctxRef.current.createOscillator();
        const gain = ctxRef.current.createGain();
        osc.connect(gain); gain.connect(ctxRef.current.destination);
        osc.frequency.value = count % 2 === 0 ? 440 : 480;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.3, ctxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctxRef.current.currentTime + 0.4);
        osc.start(); osc.stop(ctxRef.current.currentTime + 0.4);
        count++;
      };
      ring();
      intervalRef.current = setInterval(ring, 1000);
    } catch {}
  }, []);

  const stopRing = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (ctxRef.current) { ctxRef.current.close().catch(() => {}); ctxRef.current = null; }
  }, []);

  return { playRing, stopRing };
}

// ─── Get media with fallback ──────────────────────────────────────────────────
async function getMediaStream(type: "audio" | "video"): Promise<MediaStream> {
  if (type === "video") {
    try {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch {
      // Fallback: audio only if camera denied
      return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    }
  }
  return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
}

// ─── Component ───────────────────────────────────────────────────────────────
export function Teams() {
  const { user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playRing, stopRing } = useRingtone();

  const [users, setUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [search, setSearch] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  // ── Call state ──
  const [callState, setCallState] = useState<CallState>("idle");
  const [callType, setCallType] = useState<"audio" | "video">("video");
  const [callPartner, setCallPartner] = useState<User | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [incomingCall, setIncomingCall] = useState<{
    from: User; type: "audio" | "video"; offer: RTCSessionDescriptionInit
  } | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callStateRef = useRef<CallState>("idle"); // ✅ ref to track state in closures
  const callDurationRef = useRef(0);
  const callPartnerRef = useRef<User | null>(null);

  // Keep refs in sync
  useEffect(() => { callStateRef.current = callState; }, [callState]);
  useEffect(() => { callDurationRef.current = callDuration; }, [callDuration]);
  useEffect(() => { callPartnerRef.current = callPartner; }, [callPartner]);

  // ── AI state ──
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    { role: "assistant", content: "Bonjour ! Je suis votre assistant expert BIM. Posez-moi vos questions sur la construction, les normes ISO 19650, IFC, ou demandez-moi d'analyser votre projet.", id: 0 }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // ─── Socket ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const socket = io("http://localhost:3001/chat", {
      query: { userId: user.id, userName: user.name },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("users_online", (ids: string[]) => setOnlineUsers(ids));

    socket.on("new_message", (msg: Message) => {
      setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
      if (msg.type === "text" || msg.type === "file") {
        setUnreadMap(prev => ({ ...prev, [msg.senderId]: (prev[msg.senderId] || 0) + 1 }));
      }
    });

    socket.on("message_sent", (msg: Message) => {
      setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
    });

    socket.on("notification", (n: { senderId: string; senderName: string; content: string }) => {
      const notif = { ...n, id: Date.now() };
      setNotifs(prev => [...prev, notif]);
      setTimeout(() => setNotifs(prev => prev.filter(x => x.id !== notif.id)), 5000);
    });

    // ── Call events ──
    socket.on("call_ring", () => playRing());

    socket.on("call_offer", ({ from, type, offer }: { from: User; type: "audio" | "video"; offer: RTCSessionDescriptionInit }) => {
      playRing();
      setIncomingCall({ from, type, offer });
    });

    socket.on("call_answer", async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      stopRing();
      try {
        await pcRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
        setCallState("in-call");
        startTimer();
      } catch (e) { console.error("call_answer error:", e); }
    });

    socket.on("call_ice", async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      try { await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
    });

    socket.on("call_ended", () => {
      stopRing();
      doEndCall(false);
    });

    socket.on("call_user_offline", () => {
      stopRing();
      doEndCall(false);
      alert("Cet utilisateur est hors ligne.");
    });

    return () => { socket.disconnect(); stopRing(); };
  }, [user]);

  // ─── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    apiClient.get("/chat/users").then(r => setUsers(r.data));
  }, []);

  useEffect(() => {
    if (!user) return;
    apiClient.get(`/chat/unread/${user.id}`).then(r => {
      const map: Record<string, number> = {};
      r.data.forEach((i: { senderId: string; count: string }) => { map[i.senderId] = parseInt(i.count); });
      setUnreadMap(map);
    });
  }, [user]);

  useEffect(() => {
    if (!selectedContact || !user || selectedContact.id === "__ai__") return;
    apiClient.get(`/chat/conversation/${user.id}/${selectedContact.id}`)
      .then(r => setMessages(r.data));
    socketRef.current?.emit("mark_read", { senderId: selectedContact.id, receiverId: user.id });
    setUnreadMap(prev => ({ ...prev, [selectedContact.id]: 0 }));
  }, [selectedContact, user]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages]);

  // ─── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    if (!input.trim() || !selectedContact || !user) return;
    socketRef.current?.emit("send_message", {
      senderId: user.id, senderName: user.name,
      receiverId: selectedContact.id, content: input.trim(), type: "text",
    });
    setInput("");
  }, [input, selectedContact, user]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ─── File upload ──────────────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedContact || !user) return;
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiClient.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { fileName, fileUrl, fileSize } = res.data;
      socketRef.current?.emit("send_message", {
        senderId: user.id, senderName: user.name,
        receiverId: selectedContact.id,
        content: `📎 ${fileName}`,
        type: "file", fileName, fileUrl, fileSize,
      });
    } catch {
      alert("Erreur lors de l'envoi du fichier.");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  // ─── WebRTC ───────────────────────────────────────────────────────────────
  const makePC = useCallback((partnerId: string) => {
    if (pcRef.current) { pcRef.current.close(); }
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ]
    });
    pc.onicecandidate = e => {
      if (e.candidate) socketRef.current?.emit("call_ice", { to: partnerId, candidate: e.candidate });
    };
    pc.ontrack = e => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };
    pc.onconnectionstatechange = () => {
      console.log("PC state:", pc.connectionState);
    };
    pcRef.current = pc;
    return pc;
  }, []);

  const startTimer = () => {
    setCallDuration(0);
    callDurationRef.current = 0;
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setCallDuration(d => d + 1);
      callDurationRef.current += 1;
    }, 1000);
  };

  // ✅ startCall with proper error handling
  const startCall = async (partner: User, type: "audio" | "video") => {
    try {
      setCallPartner(partner);
      setCallType(type);
      setCallState("calling");

      const stream = await getMediaStream(type);
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = makePC(partner.id);
      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socketRef.current?.emit("call_offer", {
        to: partner.id,
        from: { id: user?.id, name: user?.name, role: user?.role },
        type, offer,
      });
    } catch (err) {
      console.error("startCall error:", err);
      setCallState("idle");
      setCallPartner(null);
      alert("Impossible d'accéder au micro/caméra. Veuillez autoriser l'accès dans les paramètres du navigateur.");
    }
  };

  // ✅ answerCall with proper error handling
  const answerCall = async () => {
    if (!incomingCall) return;
    stopRing();
    try {
      const { from, type, offer } = incomingCall;
      setCallPartner(from);
      setCallType(type);
      setCallState("in-call");
      startTimer();

      const stream = await getMediaStream(type);
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = makePC(from.id);
      stream.getTracks().forEach(t => pc.addTrack(t, stream));
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current?.emit("call_answer", { to: from.id, answer });
      setIncomingCall(null);
    } catch (err) {
      console.error("answerCall error:", err);
      rejectCall();
      alert("Impossible d'accéder au micro/caméra.");
    }
  };

  const rejectCall = () => {
    if (!incomingCall || !user) return;
    stopRing();
    socketRef.current?.emit("call_reject", {
      to: incomingCall.from.id,
      senderId: incomingCall.from.id,
      receiverId: user.id,
    });
    setIncomingCall(null);
  };

  // ✅ Use refs to avoid stale closure issue
  const doEndCall = useCallback((notify = true) => {
    const duration = callDurationRef.current;
    const partner = callPartnerRef.current;
    const state = callStateRef.current;

    if (notify && partner && user) {
      const wasCalling = state === "calling";
      socketRef.current?.emit("call_ended", {
        to: partner.id,
        senderId: user.id,
        receiverId: partner.id,
        duration: wasCalling ? undefined : duration,
        missed: wasCalling,
      });
    }

    localStreamRef.current?.getTracks().forEach(t => t.stop());
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null; }

    setCallState("idle");
    setCallPartner(null);
    setCallDuration(0);
    setIsScreenSharing(false);
    setIsMuted(false);
    setIsCamOff(false);
    stopRing();
  }, [user, stopRing]);

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setIsMuted(m => !m);
  };

  const toggleCam = () => {
    localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    setIsCamOff(c => !c);
  };

  const toggleScreen = async () => {
    if (!isScreenSharing) {
      try {
        const screen = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
        const track = screen.getVideoTracks()[0];
        const sender = pcRef.current?.getSenders().find(s => s.track?.kind === "video");
        await sender?.replaceTrack(track);
        if (localVideoRef.current) localVideoRef.current.srcObject = screen;
        track.onended = () => toggleScreen();
        setIsScreenSharing(true);
      } catch {}
    } else {
      try {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true });
        const track = cam.getVideoTracks()[0];
        const sender = pcRef.current?.getSenders().find(s => s.track?.kind === "video");
        await sender?.replaceTrack(track);
        if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
        setIsScreenSharing(false);
      } catch {}
    }
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ─── AI ───────────────────────────────────────────────────────────────────
  const sendAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const msg: AIMessage = { role: "user", content: aiInput.trim(), id: Date.now() };
    setAiMessages(prev => [...prev, msg]);
    setAiInput("");
    setAiLoading(true);
    try {
      const res = await apiClient.post("/ai/chat", {
        messages: [...aiMessages, msg].map(m => ({ role: m.role, content: m.content })),
      });
      setAiMessages(prev => [...prev, { role: "assistant", content: res.data.content, id: Date.now() }]);
    } catch {
      setAiMessages(prev => [...prev, { role: "assistant", content: "Erreur de connexion au serveur.", id: Date.now() }]);
    } finally { setAiLoading(false); }
  };

  const handleAiKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAI(); }
  };

  const filtered = users.filter(u => u.id !== user?.id && u.name.toLowerCase().includes(search.toLowerCase()));
  const isAI = selectedContact?.id === "__ai__";

  // ─── Render message ───────────────────────────────────────────────────────
  const renderMessage = (msg: Message) => {
    const isMine = msg.senderId === user?.id;

    if (msg.type === "call_missed" || msg.type === "call_ended") {
      return (
        <div key={msg.id} className="call-msg">
          <span>{msg.content}</span>
          <span className="call-msg-time">
            {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      );
    }

    if (msg.type === "file") {
      const isImage = msg.fileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.fileName);
      return (
        <div key={msg.id} className={`bubble ${isMine ? "sent" : "received"}`}>
          {isImage ? (
            <a href={msg.fileUrl} target="_blank" rel="noreferrer">
              <img src={msg.fileUrl} alt={msg.fileName} className="file-image" />
            </a>
          ) : (
            <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="file-attachment">
              <span className="file-icon">📎</span>
              <div className="file-info">
                <span className="file-name">{msg.fileName}</span>
                {msg.fileSize && <span className="file-size">{formatFileSize(msg.fileSize)}</span>}
              </div>
              <span className="file-dl">⬇</span>
            </a>
          )}
          <div className="bubble-time">
            {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      );
    }

    return (
      <div key={msg.id} className={`bubble ${isMine ? "sent" : "received"}`}>
        <div className="bubble-content">{msg.content}</div>
        <div className="bubble-time">
          {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="teams-page">
      <aside className="teams-sidebar">
        <div className="teams-sidebar-header">
          <h2>Teams</h2>
          <span className="online-pill">{onlineUsers.length} en ligne</span>
        </div>
        <div className="teams-search">
          <span className="search-icon">🔍</span>
          <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="teams-list">
          <div
            className={`teams-item ${selectedContact?.id === "__ai__" ? "active" : ""}`}
            onClick={() => setSelectedContact(AI_CONTACT)}
          >
            <div className="t-avatar ai">🤖</div>
            <div className="t-info">
              <span className="t-name">Assistant BIM</span>
              <span className="t-preview">Posez vos questions BIM...</span>
            </div>
            <span className="t-badge ai-badge">IA</span>
          </div>
          <div className="t-divider">Contacts</div>
          {filtered.map(u => (
            <div key={u.id} className={`teams-item ${selectedContact?.id === u.id ? "active" : ""}`} onClick={() => setSelectedContact(u)}>
              <div className="t-avatar">
                {u.name.charAt(0).toUpperCase()}
                <span className={`t-dot ${onlineUsers.includes(u.id) ? "on" : "off"}`} />
              </div>
              <div className="t-info">
                <span className="t-name">{u.name}</span>
                <span className="t-preview">{ROLE_LABELS[u.role] || u.role}</span>
              </div>
              {unreadMap[u.id] > 0 && <span className="t-badge">{unreadMap[u.id]}</span>}
            </div>
          ))}
        </div>
      </aside>

      <main className="teams-main">
        {!selectedContact ? (
          <div className="teams-empty">
            <div className="empty-icon">💬</div>
            <h3>Bienvenue sur CoBIM Teams</h3>
            <p>Sélectionnez un contact pour commencer</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="chat-header-left">
                <div className={`t-avatar ${isAI ? "ai" : ""}`}>
                  {isAI ? "🤖" : selectedContact.name.charAt(0).toUpperCase()}
                  {!isAI && <span className={`t-dot ${onlineUsers.includes(selectedContact.id) ? "on" : "off"}`} />}
                </div>
                <div>
                  <div className="chat-name">{selectedContact.name}</div>
                  <div className="chat-status">
                    {isAI ? "Assistant expert BIM • Groq AI" : onlineUsers.includes(selectedContact.id) ? "🟢 En ligne" : "⚫ Hors ligne"}
                  </div>
                </div>
              </div>
              {!isAI && (
                <div className="chat-actions">
                  <button className="call-btn audio" onClick={() => startCall(selectedContact, "audio")} title="Appel audio">📞</button>
                  <button className="call-btn video" onClick={() => startCall(selectedContact, "video")} title="Appel vidéo">📹</button>
                </div>
              )}
            </div>

            {callState !== "idle" && (
              <div className={`call-overlay ${callType}`}>
                {callType === "video" ? (
                  <div className="video-area">
                    <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
                    <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
                    {callState === "in-call" && <div className="call-timer">{fmt(callDuration)}</div>}
                  </div>
                ) : (
                  <div className="audio-call-ui">
                    <div className="audio-avatar">{callPartner?.name.charAt(0).toUpperCase()}</div>
                    <div className="audio-name">{callPartner?.name}</div>
                    <div className="audio-status">
                      {callState === "calling" ? "Sonnerie..." : callState === "in-call" ? fmt(callDuration) : "Connexion..."}
                    </div>
                  </div>
                )}
                <div className="call-controls">
                  <button className={`ctrl-btn ${isMuted ? "active" : ""}`} onClick={toggleMute}>{isMuted ? "🔇" : "🎙️"}</button>
                  {callType === "video" && (
                    <>
                      <button className={`ctrl-btn ${isCamOff ? "active" : ""}`} onClick={toggleCam}>{isCamOff ? "📷" : "📸"}</button>
                      <button className={`ctrl-btn ${isScreenSharing ? "active" : ""}`} onClick={toggleScreen}>🖥️</button>
                    </>
                  )}
                  <button className="ctrl-btn end" onClick={() => doEndCall(true)}>📵</button>
                </div>
              </div>
            )}

            {isAI ? (
              <>
                <div className="messages-area">
                  {aiMessages.map(m => (
                    <div key={m.id} className={`bubble ${m.role === "user" ? "sent" : "received"}`}>
                      {m.role === "assistant" && <div className="bubble-name">🤖 Assistant BIM</div>}
                      <div className="bubble-content">{m.content}</div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="bubble received">
                      <div className="typing-indicator"><span /><span /><span /></div>
                    </div>
                  )}
                  <div ref={aiEndRef} />
                </div>
                <div className="input-area">
                  <textarea value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={handleAiKey} placeholder="Posez votre question BIM..." rows={1} />
                  <button className="send-btn" onClick={sendAI} disabled={!aiInput.trim() || aiLoading}>➤</button>
                </div>
              </>
            ) : (
              <>
                <div className="messages-area">
                  {messages.length === 0 && <div className="no-msg">Commencez la conversation avec {selectedContact.name} 👋</div>}
                  {messages.map(renderMessage)}
                  <div ref={messagesEndRef} />
                </div>
                <div className="input-area">
                  <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileSelect} />
                  <button className="attach-btn" onClick={() => fileInputRef.current?.click()} disabled={uploadingFile} title="Envoyer un fichier">
                    {uploadingFile ? "⏳" : "📎"}
                  </button>
                  <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={`Message à ${selectedContact.name}...`} rows={1} />
                  <button className="send-btn" onClick={sendMessage} disabled={!input.trim()}>➤</button>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {incomingCall && (
        <div className="incoming-call">
          <div className="inc-avatar ringing">{incomingCall.from.name.charAt(0).toUpperCase()}</div>
          <div className="inc-info">
            <strong>{incomingCall.from.name}</strong>
            <span>{incomingCall.type === "video" ? "📹 Appel vidéo entrant" : "📞 Appel audio entrant"}</span>
          </div>
          <button className="inc-btn answer" onClick={answerCall}>✅</button>
          <button className="inc-btn reject" onClick={rejectCall}>❌</button>
        </div>
      )}

      <div className="notif-stack">
        {notifs.map(n => (
          <div key={n.id} className="notif-toast" onClick={() => {
            const sender = users.find(u => u.id === n.senderId);
            if (sender) setSelectedContact(sender);
            setNotifs(prev => prev.filter(x => x.id !== n.id));
          }}>
            <div className="notif-av">{(n.senderName || "?").charAt(0).toUpperCase()}</div>
            <div className="notif-body">
              <strong>{n.senderName}</strong>
              <span>{n.content}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}