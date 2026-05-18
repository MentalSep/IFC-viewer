import { useAppLanguage } from "./AppLanguage";

interface ViewCubeProps {
  onSetView: (direction: string) => void;
}

function ViewCube({ onSetView }: ViewCubeProps) {
  const { copy } = useAppLanguage();
  const views = [
    { label: "⬆", dir: "top", title: `${copy.viewcube.top} (1)` },
    { label: "▶", dir: "front", title: `${copy.viewcube.front} (2)` },
    { label: "◀", dir: "right", title: `${copy.viewcube.right} (3)` },
    { label: "▼", dir: "back", title: `${copy.viewcube.back} (4)` },
    { label: "◁", dir: "left", title: `${copy.viewcube.left} (5)` },
    { label: "⬇", dir: "bottom", title: `${copy.viewcube.bottom} (6)` },
  ];

  return (
    <div className="viewcube">
      <span className="viewcube-label">{copy.viewcube.label}</span>
      {views.map((v) => (
        <button
          key={v.dir}
          className="viewcube-btn"
          onClick={() => onSetView(v.dir)}
          title={v.title}
        >
          {v.label}
        </button>
      ))}
      <button
        className="viewcube-btn viewcube-iso"
        onClick={() => onSetView("iso")}
        title={`${copy.viewcube.iso} (0)`}
      >
        ◇
      </button>
    </div>
  );
}

export default ViewCube;
