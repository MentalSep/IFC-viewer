export interface ElementProperty {
  name: string;
  value: string;
}

export interface SelectedElementData {
  expressId: number;
  type: string;
  properties: ElementProperty[];
}

interface PropertiesPanelProps {
  data: SelectedElementData | null;
  onClose: () => void;
}

function friendlyType(type: string): string {
  let name = type.startsWith("Ifc") ? type.slice(3) : type;
  name = name.replace(/([a-z])([A-Z])/g, "$1 $2");
  return name;
}

function PropertiesPanel({ data, onClose }: PropertiesPanelProps) {
  if (!data) return null;

  return (
    <div className="props-panel">
      <div className="props-header">
        <h3 className="props-title">{friendlyType(data.type)}</h3>
        <button className="props-close" onClick={onClose} title="Close">
          ✕
        </button>
      </div>
      <div className="props-id">
        <span className="props-label">Express ID</span>
        <span className="props-value">#{data.expressId}</span>
      </div>
      <div className="props-divider" />
      <div className="props-list">
        {data.properties.length === 0 && (
          <p className="props-empty">No properties available</p>
        )}
        {data.properties.map((prop, i) => (
          <div key={i} className="props-row">
            <span className="props-label">{prop.name}</span>
            <span className="props-value">{prop.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertiesPanel;
