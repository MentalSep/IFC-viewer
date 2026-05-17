import { useCallback } from "react";
import { Icon } from "./ui/Icon";

interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
}

function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const handleClick = useCallback(() => {
    onToggle();
  }, [onToggle]);

  return (
    <button
      className={`theme-toggle ${theme}`}
      onClick={handleClick}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
        <span className="theme-toggle-track">
          <span className="theme-toggle-thumb">
            <span className="theme-toggle-icon">
              <Icon name={theme === "dark" ? "moon" : "sun"} />
            </span>
          </span>
        </span>
      <span className="theme-toggle-label">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}

export default ThemeToggle;
