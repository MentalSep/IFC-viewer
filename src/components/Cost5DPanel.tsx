import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import type { ElementQuantityData } from "./IFCViewer";
import type { SelectedElementData } from "./PropertiesPanel";
import type { ViewerCopy } from "../utils/viewerI18n";

type QuantityBasis = "count" | "area" | "volume" | "length" | "perimeter";

interface PriceItem {
  id: string;
  code: string;
  label: string;
  unit: string;
  currency: string;
  unitPrice: number;
  plannedQty: number;
  quantityBasis: QuantityBasis;
}

interface PriceLibrary {
  id: string;
  name: string;
  items: PriceItem[];
}

interface ProgressEntry {
  expressId: number;
  type: string;
  progress: number;
  validated: boolean;
}

interface LandXmlMetrics {
  cutVolume: number;
  fillVolume: number;
  networkLength: number;
  roadArea: number;
}

interface CostState {
  libraries: PriceLibrary[];
  links: Record<string, string>;
  progress: Record<number, ProgressEntry>;
  baseCurrency: string;
  exchangeRates: Record<string, number>;
  alertThreshold: number;
  landMetrics: LandXmlMetrics;
}

interface Cost5DPanelProps {
  projectId: string;
  selectedElement: SelectedElementData | null;
  copy: ViewerCopy["costing"];
  getQuantitySummary: () => ElementQuantityData[];
  getElementQuantity: (expressId: number) => ElementQuantityData | null;
  setElementProgress: (expressId: number, progress: number) => boolean;
}

const DEFAULT_RATES: Record<string, number> = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.17,
  MAD: 0.093,
};

const DEFAULT_LANDXML: LandXmlMetrics = {
  cutVolume: 0,
  fillVolume: 0,
  networkLength: 0,
  roadArea: 0,
};

function key(projectId: string) {
  return `ifc_cost_5d_${projectId}`;
}

function parseNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const normalized = value.replace(",", ".").replace(/[^\d.\-]/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function inferBasis(unit: string): QuantityBasis {
  const lower = unit.toLowerCase();
  if (lower.includes("m3")) return "volume";
  if (lower.includes("m2")) return "area";
  if (lower.includes("ml") || lower.includes("lm") || lower.includes("m")) return "length";
  if (lower.includes("p")) return "perimeter";
  return "count";
}

function toRowValue(row: Record<string, unknown>, names: string[]) {
  for (const name of names) {
    const found = Object.keys(row).find((keyName) => keyName.toLowerCase() === name);
    if (found && row[found] !== undefined && row[found] !== null && row[found] !== "") {
      return String(row[found]);
    }
  }
  return "";
}

function extractLandXmlMetrics(xml: string): LandXmlMetrics {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error("Invalid LandXML file");
  }
  const sumByMatchers = (matchers: string[]) => {
    let total = 0;
    const nodes = Array.from(doc.getElementsByTagName("*"));
    nodes.forEach((node) => {
      const tag = node.tagName.toLowerCase();
      if (matchers.some((matcher) => tag.includes(matcher))) {
        total += parseNumber(node.textContent ?? "");
      }
    });
    return Number(total.toFixed(3));
  };

  return {
    cutVolume: sumByMatchers(["cut", "excav", "deblai", "volcut"]),
    fillVolume: sumByMatchers(["fill", "embank", "remblai", "volfill"]),
    networkLength: sumByMatchers(["length", "pipe", "network", "linear"]),
    roadArea: sumByMatchers(["area", "road", "surface", "pavement"]),
  };
}

export default function Cost5DPanel({
  projectId,
  selectedElement,
  copy,
  getQuantitySummary,
  getElementQuantity,
  setElementProgress,
}: Cost5DPanelProps) {
  const [libraries, setLibraries] = useState<PriceLibrary[]>([]);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [progressEntries, setProgressEntries] = useState<Record<number, ProgressEntry>>({});
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(DEFAULT_RATES);
  const [alertThreshold, setAlertThreshold] = useState(10);
  const [landMetrics, setLandMetrics] = useState<LandXmlMetrics>(DEFAULT_LANDXML);
  const [status, setStatus] = useState("");
  const [selectedProgress, setSelectedProgress] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(key(projectId));
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Partial<CostState>;
      setLibraries(parsed.libraries ?? []);
      setLinks(parsed.links ?? {});
      setProgressEntries(parsed.progress ?? {});
      setBaseCurrency(parsed.baseCurrency ?? "EUR");
      setExchangeRates(parsed.exchangeRates ?? DEFAULT_RATES);
      setAlertThreshold(parsed.alertThreshold ?? 10);
      setLandMetrics(parsed.landMetrics ?? DEFAULT_LANDXML);
    } catch {
      localStorage.removeItem(key(projectId));
    }
  }, [projectId]);

  useEffect(() => {
    const payload: CostState = {
      libraries,
      links,
      progress: progressEntries,
      baseCurrency,
      exchangeRates,
      alertThreshold,
      landMetrics,
    };
    localStorage.setItem(key(projectId), JSON.stringify(payload));
  }, [
    alertThreshold,
    baseCurrency,
    exchangeRates,
    landMetrics,
    libraries,
    links,
    progressEntries,
    projectId,
  ]);

  useEffect(() => {
    if (!selectedElement || selectedElement.expressId <= 0) return;
    const current = progressEntries[selectedElement.expressId];
    setSelectedProgress(current?.progress ?? 0);
  }, [progressEntries, selectedElement]);

  const quantities = useMemo(() => getQuantitySummary(), [getQuantitySummary]);
  const allItems = useMemo(() => libraries.flatMap((lib) => lib.items), [libraries]);
  const itemById = useMemo(() => {
    const map = new Map<string, PriceItem>();
    allItems.forEach((item) => map.set(item.id, item));
    return map;
  }, [allItems]);

  const currencyChoices = useMemo(
    () =>
      Array.from(
        new Set([
          ...Object.keys(exchangeRates),
          ...allItems.map((item) => item.currency.toUpperCase()),
          baseCurrency.toUpperCase(),
        ]),
      ),
    [allItems, baseCurrency, exchangeRates],
  );

  const toBase = (amount: number, currency: string) => {
    const rate = exchangeRates[currency.toUpperCase()] ?? 1;
    return amount * rate;
  };

  const totals = useMemo(() => {
    const rows = quantities.map((q) => {
      const linkedId = links[q.type];
      const item = linkedId ? itemById.get(linkedId) : undefined;
      if (!item) {
        return {
          ...q,
          item: null,
          quantityUsed: 0,
          modelAmountBase: 0,
          estimatedAmountBase: 0,
        };
      }
      const quantityUsed =
        item.quantityBasis === "area"
          ? q.area
          : item.quantityBasis === "volume"
            ? q.volume
            : item.quantityBasis === "length"
              ? q.length
              : item.quantityBasis === "perimeter"
                ? q.perimeter
                : q.count;
      const modelAmountBase = toBase(quantityUsed * item.unitPrice, item.currency);
      const estimatedAmountBase = toBase(item.plannedQty * item.unitPrice, item.currency);
      return { ...q, item, quantityUsed, modelAmountBase, estimatedAmountBase };
    });

    const budgetModel = rows.reduce((acc, row) => acc + row.modelAmountBase, 0);
    const budgetEstimated = rows.reduce((acc, row) => acc + row.estimatedAmountBase, 0);
    const variance = budgetModel - budgetEstimated;
    const variancePct = budgetEstimated > 0 ? (Math.abs(variance) / budgetEstimated) * 100 : 0;
    return { rows, budgetModel, budgetEstimated, variance, variancePct };
  }, [itemById, links, quantities]);

  const importBpuExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const first = workbook.SheetNames[0];
      if (!first) throw new Error("Workbook has no sheet");
      const sheet = workbook.Sheets[first];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      const items: PriceItem[] = rows
        .map((row, idx) => {
          const code = toRowValue(row, ["code", "ref", "reference", "article"]);
          const label = toRowValue(row, ["designation", "label", "description", "item"]);
          const unit = toRowValue(row, ["unit", "u", "unite", "um"]) || "u";
          const currency = (toRowValue(row, ["currency", "devise"]) || baseCurrency).toUpperCase();
          const unitPrice = parseNumber(
            toRowValue(row, ["unitprice", "price", "prix", "pu", "cost"]),
          );
          const plannedQty = parseNumber(
            toRowValue(row, ["plannedqty", "qteprevue", "quantity", "qty"]),
          );
          const quantityBasis = inferBasis(unit);
          return {
            id: `${file.name}-${idx}-${code || label || "line"}`,
            code: code || `ITEM-${idx + 1}`,
            label: label || `Line ${idx + 1}`,
            unit,
            currency,
            unitPrice,
            plannedQty,
            quantityBasis,
          };
        })
        .filter((item) => item.unitPrice > 0);

      const nextLibrary: PriceLibrary = {
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        items,
      };
      setLibraries((prev) => [nextLibrary, ...prev]);
      setStatus(`${items.length} items imported from ${file.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : copy.importFailed;
      setStatus(`${copy.importFailed}: ${message}`);
    } finally {
      event.target.value = "";
    }
  };

  const importLandXml = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const xml = await file.text();
      const metrics = extractLandXmlMetrics(xml);
      setLandMetrics(metrics);
      setStatus(`${copy.landXmlMetrics}: ${file.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : copy.importFailed;
      setStatus(`${copy.importFailed}: ${message}`);
    } finally {
      event.target.value = "";
    }
  };

  const applyProgress = () => {
    if (!selectedElement || selectedElement.expressId <= 0) return;
    const ok = setElementProgress(selectedElement.expressId, selectedProgress);
    if (!ok) return;
    setProgressEntries((prev) => ({
      ...prev,
      [selectedElement.expressId]: {
        expressId: selectedElement.expressId,
        type: selectedElement.type,
        progress: selectedProgress,
        validated: prev[selectedElement.expressId]?.validated ?? false,
      },
    }));
  };

  const toggleValidate = (expressId: number) => {
    setProgressEntries((prev) => ({
      ...prev,
      [expressId]: {
        ...prev[expressId],
        validated: !prev[expressId]?.validated,
      },
    }));
  };

  const situationRows = useMemo(() => {
    return Object.values(progressEntries)
      .filter((entry) => entry.progress > 0)
      .map((entry) => {
        const q = getElementQuantity(entry.expressId);
        const linkedItemId = links[entry.type];
        const item = linkedItemId ? itemById.get(linkedItemId) : undefined;
        const quantityBase = q
          ? item?.quantityBasis === "area"
            ? q.area
            : item?.quantityBasis === "volume"
              ? q.volume
              : item?.quantityBasis === "length"
                ? q.length
                : item?.quantityBasis === "perimeter"
                  ? q.perimeter
                  : q.count
          : 0;
        const doneQty = quantityBase * (entry.progress / 100);
        const amount = item ? toBase(doneQty * item.unitPrice, item.currency) : 0;
        return {
          expressId: entry.expressId,
          type: entry.type,
          progress: entry.progress,
          validated: entry.validated ? "Yes" : "No",
          quantityDone: Number(doneQty.toFixed(3)),
          amountBase: Number(amount.toFixed(2)),
          itemCode: item?.code ?? "",
        };
      });
  }, [getElementQuantity, itemById, links, progressEntries]);

  const generateSituationPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Situation de travaux", 14, 16);
    doc.text(`Currency: ${baseCurrency}`, 14, 24);
    let y = 34;
    situationRows.forEach((row, index) => {
      doc.text(
        `${index + 1}. #${row.expressId} ${row.type} | ${row.progress}% | ${row.quantityDone} | ${row.amountBase}`,
        14,
        y,
      );
      y += 7;
      if (y > 280) {
        doc.addPage();
        y = 16;
      }
    });
    doc.save("situation-travaux.pdf");
    setStatus(copy.generated);
  };

  const generateSituationXls = () => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(situationRows);
    XLSX.utils.book_append_sheet(workbook, sheet, "Situation");
    XLSX.writeFile(workbook, "situation-travaux.xls");
    setStatus(copy.generated);
  };

  const selectedInfo =
    selectedElement && selectedElement.expressId > 0
      ? `${selectedElement.type} #${selectedElement.expressId}`
      : copy.noSelection;

  const alertTriggered = totals.variancePct > alertThreshold;

  return (
    <div className="cost5d-panel">
      <section className="cost5d-card">
        <h3>{copy.title}</h3>
        <p>{copy.subtitle}</p>
        <div className="cost5d-upload-row">
          <label className="cost5d-upload">
            <input type="file" accept=".xlsx,.xls" onChange={importBpuExcel} />
            <span>{copy.importBpu}</span>
          </label>
          <label className="cost5d-upload">
            <input type="file" accept=".xml,.landxml,text/xml,application/xml" onChange={importLandXml} />
            <span>{copy.importLandXml}</span>
          </label>
        </div>
        <p className="cost5d-status">{status}</p>
      </section>

      <section className="cost5d-card">
        <h4>{copy.liveDashboard}</h4>
        <div className="cost5d-settings">
          <label>
            {copy.baseCurrency}
            <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
              {currencyChoices.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
          <label>
            {copy.threshold}
            <input
              type="number"
              min={0}
              max={100}
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseNumber(e.target.value))}
            />
          </label>
        </div>
        <div className="cost5d-metrics">
          <div>
            <span>{copy.budgetEstimated}</span>
            <strong>{totals.budgetEstimated.toFixed(2)} {baseCurrency}</strong>
          </div>
          <div>
            <span>{copy.budgetModel}</span>
            <strong>{totals.budgetModel.toFixed(2)} {baseCurrency}</strong>
          </div>
          <div className={alertTriggered ? "alert" : ""}>
            <span>{copy.variance}</span>
            <strong>{totals.variance.toFixed(2)} {baseCurrency}</strong>
          </div>
        </div>
        {alertTriggered && <p className="cost5d-alert">{copy.varianceAlert}</p>}
      </section>

      <section className="cost5d-card">
        <h4>{copy.quantityAuto}</h4>
        {libraries.length === 0 ? (
          <p className="cost5d-muted">{copy.noLibraries}</p>
        ) : quantities.length === 0 ? (
          <p className="cost5d-muted">{copy.noQuantities}</p>
        ) : (
          <div className="cost5d-qty-table">
            {totals.rows.map((row) => (
              <div key={row.type} className="cost5d-qty-row">
                <div>
                  <strong>{row.type}</strong>
                  <span>
                    {copy.quantityCount}: {row.count} | {copy.quantityArea}: {row.area.toFixed(2)} |{" "}
                    {copy.quantityVolume}: {row.volume.toFixed(2)} | {copy.quantityLength}: {row.length.toFixed(2)}
                  </span>
                </div>
                <div className="cost5d-link-col">
                  <span>{copy.linkBpu}</span>
                  <select
                    value={links[row.type] ?? ""}
                    onChange={(e) =>
                      setLinks((prev) => ({
                        ...prev,
                        [row.type]: e.target.value,
                      }))
                    }
                  >
                    <option value="">{copy.noLink}</option>
                    {allItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.code} - {item.label} ({item.unitPrice} {item.currency}/{item.unit})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="cost5d-card">
        <h4>{copy.progressTitle}</h4>
        <p>{copy.selectedPiece}: {selectedInfo}</p>
        <div className="cost5d-progress-row">
          <input
            type="range"
            min={0}
            max={100}
            value={selectedProgress}
            onChange={(e) => setSelectedProgress(parseNumber(e.target.value))}
            disabled={!selectedElement || selectedElement.expressId <= 0}
          />
          <span>{selectedProgress}%</span>
          <button
            type="button"
            onClick={applyProgress}
            disabled={!selectedElement || selectedElement.expressId <= 0}
          >
            {copy.applyProgress}
          </button>
        </div>
        <div className="cost5d-progress-list">
          {Object.values(progressEntries).map((entry) => (
            <div key={entry.expressId} className="cost5d-progress-item">
              <span>
                #{entry.expressId} {entry.type} · {entry.progress}%
              </span>
              <label>
                <input
                  type="checkbox"
                  checked={entry.validated}
                  onChange={() => toggleValidate(entry.expressId)}
                />
                {copy.validate}
              </label>
            </div>
          ))}
        </div>
        <div className="cost5d-actions">
          <button type="button" onClick={generateSituationPdf}>
            {copy.generatePdf}
          </button>
          <button type="button" onClick={generateSituationXls}>
            {copy.generateXls}
          </button>
        </div>
      </section>

      <section className="cost5d-card">
        <h4>{copy.disciplineTitle}</h4>
        <div className="cost5d-disciplines">
          <div><strong>{copy.building}</strong><span>LOD 300-400</span></div>
          <div><strong>{copy.art}</strong><span>LOD 400</span></div>
          <div><strong>{copy.infra}</strong><span>LandXML / Civil 3D</span></div>
        </div>
        <p>{copy.landXmlMetrics}</p>
        <div className="cost5d-landxml-grid">
          <span>{copy.cutVolume}: {landMetrics.cutVolume}</span>
          <span>{copy.fillVolume}: {landMetrics.fillVolume}</span>
          <span>{copy.networkLength}: {landMetrics.networkLength}</span>
          <span>{copy.roadArea}: {landMetrics.roadArea}</span>
        </div>
      </section>
    </div>
  );
}

