import { useEffect, useCallback } from "react";
import { useAppLanguage } from "./AppLanguage";

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUT_KEYS = [
  "fitCamera",
  "toggleGrid",
  "toggleWireframe",
  "toggleTransparency",
  "toggleMeasure",
  "clearMeasurements",
  "screenshot",
  "deselectElement",
  "showShortcuts",
  "focusSearch",
  "zoomIn",
  "zoomOut",
  "viewAngles",
  "isometricView",
  "cycleThemes",
] as const;

type ShortcutKey = (typeof SHORTCUT_KEYS)[number];

const SHORTCUT_MAPPINGS: Record<ShortcutKey, string> = {
  fitCamera: "F",
  toggleGrid: "G",
  toggleWireframe: "W",
  toggleTransparency: "T",
  toggleMeasure: "M",
  clearMeasurements: "C",
  screenshot: "P",
  deselectElement: "Esc",
  showShortcuts: "?",
  focusSearch: "Ctrl+K",
  zoomIn: "+",
  zoomOut: "-",
  viewAngles: "1–6",
  isometricView: "0",
  cycleThemes: "L",
};

function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
  const { copy } = useAppLanguage();
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

  const shortcuts = SHORTCUT_KEYS.map((key) => ({
    keys: SHORTCUT_MAPPINGS[key],
    action: copy.shortcuts[key],
  }));

  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2 className="shortcuts-title">{copy.shortcuts.title}</h2>
          <button className="shortcuts-close" onClick={onClose}>
            x
          </button>
        </div>
        <div className="shortcuts-list">
          {shortcuts.map((s) => (
            <div key={s.keys} className="shortcut-row">
              <kbd className="shortcut-key">{s.keys}</kbd>
              <span className="shortcut-action">{s.action}</span>
            </div>
          ))}
        </div>
        <p className="shortcuts-hint">{copy.shortcuts.closeHint}</p>
      </div>
    </div>
  );
}

export default KeyboardShortcuts;
