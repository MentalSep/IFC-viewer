import type { SVGProps } from "react";

export type IconName =
  | "building"
  | "cube"
  | "chat"
  | "bolt"
  | "folder"
  | "calendar"
  | "users"
  | "plus"
  | "search"
  | "close"
  | "moon"
  | "sun"
  | "wireframe"
  | "grid"
  | "xray"
  | "measure"
  | "trash"
  | "clip"
  | "zoomIn"
  | "zoomOut"
  | "camera"
  | "pause"
  | "keyboard"
  | "file"
  | "history"
  | "download"
  | "eye"
  | "send"
  | "info"
  | "warning"
  | "critical"
  | "drafting"
  | "wrench"
  | "snow"
  | "clipboard"
  | "flame"
  | "palette";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const DEFAULT_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Icon({ name, className, ...props }: IconProps) {
  const iconClassName = className ? `ui-icon ${className}` : "ui-icon";

  switch (name) {
    case "building":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M4 20h16" />
          <path d="M6 20V6l6-3 6 3v14" />
          <path d="M10 9h.01M14 9h.01M10 13h.01M14 13h.01" />
        </svg>
      );
    case "cube":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" />
          <path d="M12 20v-9" />
          <path d="M20 6.5l-8 4.5-8-4.5" />
        </svg>
      );
    case "chat":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M4 5h16v10H8l-4 4z" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M13 2L6 13h5l-1 9 8-12h-5z" />
        </svg>
      );
    case "folder":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M3 7h6l2 2h10v10H3z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "users":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
          <circle cx="12" cy="9" r="3" />
          <path d="M5 21v-1a3 3 0 0 1 3-3M19 21v-1a3 3 0 0 0-3-3" />
        </svg>
      );
    case "plus":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "search":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );
    case "close":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "moon":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
        </svg>
      );
    case "sun":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "wireframe":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M4 12h16M12 4v16" />
        </svg>
      );
    case "grid":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M4 4h16v16H4zM4 12h16M12 4v16" />
        </svg>
      );
    case "xray":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4a8 8 0 0 1 0 16z" />
        </svg>
      );
    case "measure":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M4 16l8-8 8 8" />
          <path d="M4 20h16" />
        </svg>
      );
    case "trash":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
        </svg>
      );
    case "clip":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M8 12l6-6a3 3 0 1 1 4 4l-8 8a5 5 0 1 1-7-7l8-8" />
        </svg>
      );
    case "zoomIn":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
        </svg>
      );
    case "zoomOut":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3M8 11h6" />
        </svg>
      );
    case "camera":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <circle cx="12" cy="13.5" r="3.2" />
          <path d="M8 7l1.5-2h5L16 7" />
        </svg>
      );
    case "pause":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M8 5v14M16 5v14" />
        </svg>
      );
    case "keyboard":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" />
        </svg>
      );
    case "file":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M6 2h8l4 4v16H6z" />
          <path d="M14 2v4h4" />
        </svg>
      );
    case "history":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v4h4M12 7v6l4 2" />
        </svg>
      );
    case "download":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M12 4v11M8 11l4 4 4-4M4 20h16" />
        </svg>
      );
    case "eye":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "send":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M3 12l18-9-5 18-3-7z" />
        </svg>
      );
    case "info":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10v6M12 7h.01" />
        </svg>
      );
    case "warning":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M12 3l9 16H3z" />
          <path d="M12 9v5M12 17h.01" />
        </svg>
      );
    case "critical":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6M12 17h.01" />
        </svg>
      );
    case "drafting":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M4 20l8-16 8 16M8 12h8" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M14 7a4 4 0 0 0 4.5 4.5l-8.8 8.8a2 2 0 0 1-2.8-2.8l8.8-8.8A4 4 0 0 0 14 7z" />
        </svg>
      );
    case "snow":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12M2 12h20" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <rect x="6" y="4" width="12" height="18" rx="2" />
          <path d="M9 4.5h6v3H9zM9 11h6M9 15h6" />
        </svg>
      );
    case "flame":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M12 3s4 3.5 4 7a4 4 0 0 1-8 0c0-2.3 1.5-4.5 4-7z" />
          <path d="M10 14a2 2 0 0 0 4 0" />
        </svg>
      );
    case "palette":
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h2a4 4 0 0 0 0-8z" />
          <path d="M7 10h.01M9 7h.01M13 7h.01M15 10h.01" />
        </svg>
      );
    default:
      return (
        <svg {...DEFAULT_PROPS} className={iconClassName} {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
