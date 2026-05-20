interface HUDProps {
  enabled: boolean;
  mode: "VIEW" | "SELECT" | "ANALYSIS" | "SIMULATION";
  selectedName?: string | null;
}

export function HUD({ enabled, mode, selectedName }: HUDProps) {
  if (!enabled) return null;

  return (
    <div className="panel hud" style={{ position: "absolute", right: 18, top: 18, padding: 10 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{mode}</div>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>{selectedName ?? "No selection"}</div>
      </div>
    </div>
  );
}
