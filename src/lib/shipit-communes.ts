export interface ShipitCommune {
  id: number;
  name: string;
}

export const SHIPIT_COMMUNES: ShipitCommune[] = [
  // Región Metropolitana
  { id: 295, name: "Santiago Centro" },
  { id: 317, name: "Providencia" },
  { id: 308, name: "Las Condes" },
  { id: 326, name: "Vitacura" },
  { id: 314, name: "Ñuñoa" },
  { id: 313, name: "Maipú" },
  { id: 327, name: "Puente Alto" },
  { id: 304, name: "La Florida" },
  { id: 324, name: "San Miguel" },
  { id: 307, name: "La Reina" },
  { id: 319, name: "Quilicura" },
  { id: 316, name: "Peñalolén" },
  { id: 333, name: "San Bernardo" },
  { id: 296, name: "Cerrillos" },
  { id: 301, name: "Huechuraba" },
  { id: 321, name: "Recoleta" },
  { id: 302, name: "Independencia" },
  { id: 312, name: "Macul" },
  { id: 309, name: "Lo Barnechea" },
  { id: 300, name: "Estación Central" },
  { id: 297, name: "Cerro Navia" },
  { id: 298, name: "Conchalí" },
  { id: 318, name: "Pudahuel" },
  { id: 306, name: "La Pintana" },
  { id: 299, name: "El Bosque" },
  { id: 325, name: "San Ramón" },
  { id: 305, name: "La Granja" },
  { id: 315, name: "Pedro Aguirre Cerda" },
  { id: 310, name: "Lo Espejo" },
  { id: 334, name: "Buin" },
  { id: 331, name: "Lampa" },
  { id: 337, name: "Melipilla" },
  { id: 342, name: "Talagante" },
  // Región de Valparaíso
  { id: 45, name: "Valparaíso" },
  { id: 51, name: "Viña del Mar" },
  { id: 67, name: "San Antonio" },
  { id: 46, name: "Casablanca" },
  { id: 68, name: "Algarrobo" },
  { id: 69, name: "Cartagena" },
  // Región de Antofagasta
  { id: 12, name: "Antofagasta" },
  { id: 16, name: "Calama" },
  // Región de Atacama
  { id: 21, name: "Copiapó" },
  // Región de Coquimbo
  { id: 30, name: "La Serena" },
  { id: 31, name: "Coquimbo" },
  { id: 40, name: "Ovalle" },
  // Región del Maule
  { id: 116, name: "Talca" },
  { id: 129, name: "Curicó" },
  { id: 138, name: "Linares" },
  // Región del Biobío
  { id: 146, name: "Concepción" },
  { id: 147, name: "Coronel" },
  { id: 148, name: "Chiguayante" },
  { id: 151, name: "Lota" },
  { id: 165, name: "Los Ángeles" },
  { id: 179, name: "Chillán" },
  // Región de La Araucanía
  { id: 200, name: "Temuco" },
  // Región de O'Higgins
  { id: 83, name: "Rancagua" },
  // Región de Los Ríos
  { id: 232, name: "Valdivia" },
  // Región de Los Lagos
  { id: 244, name: "Puerto Montt" },
  { id: 263, name: "Osorno" },
  // Región de Magallanes
  { id: 284, name: "Punta Arenas" },
  // Región de Tarapacá
  { id: 5, name: "Iquique" },
  // Región de Arica y Parinacota
  { id: 1, name: "Arica" },
  { id: 6, name: "Alto Hospicio" },
];

const _normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function filterCommunes(query: string): ShipitCommune[] {
  if (!query.trim()) return [];
  const q = _normalize(query);
  return SHIPIT_COMMUNES.filter((c) => _normalize(c.name).includes(q)).slice(0, 8);
}
