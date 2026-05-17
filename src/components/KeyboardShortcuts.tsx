import { useEffect, useCallback } from "react";

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: "F", action: "Fit camera to model" },
  { keys: "G", action: "Toggle grid" },
  { keys: "W", action: "Toggle wireframe" },
  { keys: "T", action: "Toggle transparency (X-ray)" },
  { keys: "M", action: "Toggle measurement tool" },
  { keys: "C", action: "Clear measurements" },
  { keys: "P", action: "Take screenshot" },
  { keys: "Esc", action: "Deselect element" },
  { keys: "?", action: "Show shortcuts" },
  { keys: "Ctrl+K", action: "Focus search" },
  { keys: "+", action: "Zoom in" },
  { keys: "-", action: "Zoom out" },
  { keys: "1–6", action: "View angles (Top/Front/Right/Back/Left/Bottom)" },
  { keys: "0", action: "Isometric view" },
  { keys: "L", action: "Toggle light/dark mode" },
];

function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    },
    [open, onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  if (!open) return null;

  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2 className="shortcuts-title">Keyboard Shortcuts</h2>
          <button className="shortcuts-close" onClick={onClose}>
            x
          </button>
        </div>
        <div className="shortcuts-list">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="shortcut-row">
              <kbd className="shortcut-key">{s.keys}</kbd>
              <span className="shortcut-action">{s.action}</span>
            </div>
          ))}
        </div>
        <p className="shortcuts-hint">
          Press <kbd>?</kbd> to toggle this panel &nbsp;|&nbsp; <kbd>Esc</kbd>{" "}
          to close
        </p>
      </div>
    </div>
  );
}

export default KeyboardShortcuts;
