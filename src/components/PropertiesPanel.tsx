import { useMemo, useState } from "react";
import { useAppLanguage } from "./AppLanguage";

export interface ElementProperty {
  name: string;
  value: string;
}

export interface SelectedElementData {
  expressId: number;
  type: string;
  properties: ElementProperty[];
  metrics?: {
    dimensions: { x: number; y: number; z: number };
    center: { x: number; y: number; z: number };
    triangles: number;
  };
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
  const { copy } = useAppLanguage();
  const [query, setQuery] = useState("");
  if (!data) return null;

  const filteredProperties = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.properties;
    return data.properties.filter(
      (prop) =>
        prop.name.toLowerCase().includes(q) ||
        prop.value.toLowerCase().includes(q),
    );
  }, [data.properties, query]);

  const handleCopy = async () => {
    const payload = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(payload);
  };

  return (
    <div className="props-panel">
      <div className="props-header">
        <h3 className="props-title">{friendlyType(data.type)}</h3>
        <button className="props-close" onClick={onClose} title={copy.properties.close}>
          ✕
        </button>
      </div>
      <div className="props-id">
        <span className="props-label">{copy.properties.expressId}</span>
        <span className="props-value">#{data.expressId}</span>
      </div>
      <div className="props-divider" />
      {data.metrics && (
        <>
          <div className="props-metrics-grid">
            <div className="props-metric">
              <span className="props-label">{copy.properties.dimensions}</span>
              <span className="props-value">
                {data.metrics.dimensions.x} × {data.metrics.dimensions.y} × {data.metrics.dimensions.z}
              </span>
            </div>
            <div className="props-metric">
              <span className="props-label">{copy.properties.center}</span>
              <span className="props-value">
                {data.metrics.center.x}, {data.metrics.center.y}, {data.metrics.center.z}
              </span>
            </div>
            <div className="props-metric">
              <span className="props-label">{copy.properties.triangles}</span>
              <span className="props-value">{data.metrics.triangles}</span>
            </div>
            <div className="props-metric">
              <span className="props-label">{copy.properties.propertiesCount}</span>
              <span className="props-value">{data.properties.length}</span>
            </div>
          </div>
          <div className="props-divider" />
        </>
      )}
      <div className="props-tools">
        <input
          className="props-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.properties.search}
        />
        <button className="props-copy-btn" onClick={handleCopy} type="button">
          {copy.properties.copyJson}
        </button>
      </div>
      <div className="props-list">
        {filteredProperties.length === 0 && (
          <p className="props-empty">{copy.properties.noProperties}</p>
        )}
        {filteredProperties.map((prop, i) => (
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
