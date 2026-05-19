export type QuantityBasis = "count" | "area" | "volume" | "length" | "perimeter";

export interface MarketSnapshot {
  sourceUrl: string;
  latestDate: string;
  latestValue: number;
  referenceDate: string | null;
  referenceValue: number | null;
  trendFactor: number;
}

interface MarketProfile {
  name: string;
  keywords: string[];
  basePrice: number;
  multipliers: Record<QuantityBasis, number>;
}

const FRED_CSV_URL = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=PCU44414441";
const LOCAL_CSV_URL = "/data/fred-building-materials.csv";
const MARKET_PROFILES: MarketProfile[] = [
  {
    name: "Concrete",
    keywords: ["concrete", "beton", "cement", "mortar"],
    basePrice: 120,
    multipliers: { count: 1, area: 0.85, volume: 2.5, length: 0.3, perimeter: 0.35 },
  },
  {
    name: "Steel",
    keywords: ["steel", "rebar", "reinf", "acier", "metal"],
    basePrice: 180,
    multipliers: { count: 1, area: 1.1, volume: 2.2, length: 0.45, perimeter: 0.5 },
  },
  {
    name: "Timber",
    keywords: ["wood", "timber", "lumber", "bois"],
    basePrice: 95,
    multipliers: { count: 1, area: 0.9, volume: 1.8, length: 0.4, perimeter: 0.35 },
  },
  {
    name: "Electrical",
    keywords: ["elect", "cable", "wire", "lighting"],
    basePrice: 70,
    multipliers: { count: 1, area: 0.7, volume: 1.4, length: 0.9, perimeter: 0.45 },
  },
  {
    name: "Plumbing",
    keywords: ["pipe", "plumb", "sanitary", "water"],
    basePrice: 80,
    multipliers: { count: 1, area: 0.75, volume: 1.5, length: 1.0, perimeter: 0.5 },
  },
  {
    name: "Earthworks",
    keywords: ["excavat", "earth", "soil", "fill", "cut", "grading"],
    basePrice: 45,
    multipliers: { count: 1, area: 0.6, volume: 1.6, length: 0.35, perimeter: 0.35 },
  },
  {
    name: "Finishes",
    keywords: ["paint", "plaster", "finish", "coating", "tile", "floor"],
    basePrice: 60,
    multipliers: { count: 1, area: 1.2, volume: 1.2, length: 0.25, perimeter: 0.4 },
  },
];

function parseSeriesCsv(csv: string) {
  const rows = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length <= 1) {
    throw new Error("Market index CSV is empty");
  }

  return rows.slice(1).map((line) => {
    const [date, value] = line.split(",");
    return {
      date,
      value: Number(value),
    };
  }).filter((row) => row.date && Number.isFinite(row.value));
}

function resolveProfile(label: string) {
  const haystack = label.toLowerCase();
  return (
    MARKET_PROFILES.find((profile) =>
      profile.keywords.some((keyword) => haystack.includes(keyword)),
    ) ?? {
      name: "General",
      basePrice: 100,
      multipliers: { count: 1, area: 0.85, volume: 1.5, length: 0.35, perimeter: 0.35 },
    }
  );
}

export function estimateUnitPrice(
  label: string,
  quantityBasis: QuantityBasis,
  referencePrice: number,
  snapshot: MarketSnapshot | null,
) {
  const profile = resolveProfile(label);
  const basisMultiplier = profile.multipliers[quantityBasis] ?? 1;
  const basePrice = referencePrice > 0 ? referencePrice : profile.basePrice;
  const trendFactor = snapshot?.trendFactor ?? 1;
  const suggested = Number((basePrice * basisMultiplier * trendFactor).toFixed(2));

  return {
    suggested,
    profileName: profile.name,
    trendFactor,
    sourceLabel: snapshot
      ? `FRED ${snapshot.latestDate} (${snapshot.latestValue.toFixed(2)})`
      : "Local estimate",
  };
}

export async function fetchBuildingMaterialMarketSnapshot(): Promise<MarketSnapshot> {
  const response =
    (await fetch(LOCAL_CSV_URL).catch(() => null)) ??
    (await fetch(FRED_CSV_URL).catch(() => null));
  if (!response || !response.ok) {
    throw new Error("Unable to fetch market price index");
  }

  const rows = parseSeriesCsv(await response.text());
  if (rows.length === 0) {
    throw new Error("Market price index has no data");
  }

  const latest = rows[rows.length - 1];
  const reference = rows[Math.max(0, rows.length - 13)] ?? null;
  const trendFactor =
    reference && reference.value > 0 ? latest.value / reference.value : 1;

  return {
    sourceUrl: FRED_CSV_URL,
    latestDate: latest.date,
    latestValue: latest.value,
    referenceDate: reference?.date ?? null,
    referenceValue: reference?.value ?? null,
    trendFactor: Number(trendFactor.toFixed(4)),
  };
}
