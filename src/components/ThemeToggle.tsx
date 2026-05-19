import { useCallback } from "react";
import { Icon } from "./ui/Icon";
import type { ViewerTheme } from "../utils/viewerI18n";

interface ThemeToggleProps {
  theme: ViewerTheme;
  onToggle: () => void;
  label: string;
}

function ThemeToggle({ theme, onToggle, label }: ThemeToggleProps) {
  const handleClick = useCallback(() => {
    onToggle();
  }, [onToggle]);

  return (
    <button
      className={`theme-toggle ${theme}`}
      onClick={handleClick}
      title={label}
      aria-label={label}
    >
        <span className="theme-toggle-track">
          <span className="theme-toggle-thumb">
            <span className="theme-toggle-icon">
              <Icon
                name={
                  theme === "dark"
                    ? "moon"
                    : theme === "light"
                      ? "sun"
                      : theme === "midnight"
                        ? "snow"
                        : theme === "forest"
                          ? "flame"
                          : "palette"
                }
              />
            </span>
          </span>
        </span>
      <span className="theme-toggle-label">
        {label}
      </span>
    </button>
  );
}

export default ThemeToggle;
