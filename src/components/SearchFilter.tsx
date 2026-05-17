import { useState, useCallback, useRef, useEffect } from "react";
import { Icon } from "./ui/Icon";

interface SearchFilterProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

function SearchFilter({
  placeholder = "Search elements...",
  value,
  onChange,
}: SearchFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChange("");
    inputRef.current?.focus();
  }, [onChange]);

  // Ctrl+K / Cmd+K to focus
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className={`search-filter${focused ? " focused" : ""}`}>
      <span className="search-filter-icon">
        <Icon name="search" />
      </span>
      <input
        ref={inputRef}
        className="search-filter-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button
          className="search-filter-clear"
          onClick={handleClear}
          title="Clear"
        >
          <Icon name="close" />
        </button>
      )}
      <kbd className="search-filter-kbd">Ctrl+K</kbd>
    </div>
  );
}

export default SearchFilter;
