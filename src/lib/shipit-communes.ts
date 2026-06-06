export interface ShipitCommune {
  id: number;
  name: string;
}

// Región Metropolitana commune IDs — used for region label and delivery estimate
const RM_IDS = new Set([
  295, 296, 297, 298, 299, 300, 301, 302, 304, 305, 306, 307,
  308, 309, 310, 312, 313, 314, 315, 316, 317, 318, 319, 321,
  324, 325, 326, 327, 331, 333, 334, 337, 342,
]);

export function getRegionLabel(communeId: number): string | null {
  return RM_IDS.has(communeId) ? "Región Metropolitana" : null;
}

const _normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function filterCommunes(
  communes: ShipitCommune[],
  query: string
): ShipitCommune[] {
  if (!query.trim()) return [];
  const q = _normalize(query);
  return communes.filter((c) => _normalize(c.name).includes(q)).slice(0, 8);
}
