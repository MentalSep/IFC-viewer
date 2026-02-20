interface ViewCubeProps {
  onSetView: (direction: string) => void;
}

const VIEWS = [
  { label: "⬆", dir: "top", title: "Top (1)" },
  { label: "▶", dir: "front", title: "Front (2)" },
  { label: "◀", dir: "right", title: "Right (3)" },
  { label: "▼", dir: "back", title: "Back (4)" },
  { label: "◁", dir: "left", title: "Left (5)" },
  { label: "⬇", dir: "bottom", title: "Bottom (6)" },
];

function ViewCube({ onSetView }: ViewCubeProps) {
  return (
    <div className="viewcube">
      <span className="viewcube-label">Views</span>
      {VIEWS.map((v) => (
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
        title="Isometric (0)"
      >
        ◇
      </button>
    </div>
  );
}

export default ViewCube;
