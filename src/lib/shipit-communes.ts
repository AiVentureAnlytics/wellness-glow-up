export interface ShipitCommune {
  id: number;
  name: string;
  region: string;
}

export const SHIPIT_COMMUNES: ShipitCommune[] = [
  // Región Metropolitana
  { id: 295, name: "Santiago Centro",     region: "Región Metropolitana" },
  { id: 317, name: "Providencia",         region: "Región Metropolitana" },
  { id: 308, name: "Las Condes",          region: "Región Metropolitana" },
  { id: 326, name: "Vitacura",            region: "Región Metropolitana" },
  { id: 314, name: "Ñuñoa",              region: "Región Metropolitana" },
  { id: 313, name: "Maipú",              region: "Región Metropolitana" },
  { id: 327, name: "Puente Alto",         region: "Región Metropolitana" },
  { id: 304, name: "La Florida",          region: "Región Metropolitana" },
  { id: 324, name: "San Miguel",          region: "Región Metropolitana" },
  { id: 307, name: "La Reina",            region: "Región Metropolitana" },
  { id: 319, name: "Quilicura",           region: "Región Metropolitana" },
  { id: 316, name: "Peñalolén",          region: "Región Metropolitana" },
  { id: 333, name: "San Bernardo",        region: "Región Metropolitana" },
  { id: 296, name: "Cerrillos",           region: "Región Metropolitana" },
  { id: 301, name: "Huechuraba",          region: "Región Metropolitana" },
  { id: 321, name: "Recoleta",            region: "Región Metropolitana" },
  { id: 302, name: "Independencia",       region: "Región Metropolitana" },
  { id: 312, name: "Macul",              region: "Región Metropolitana" },
  { id: 309, name: "Lo Barnechea",        region: "Región Metropolitana" },
  { id: 300, name: "Estación Central",    region: "Región Metropolitana" },
  { id: 297, name: "Cerro Navia",         region: "Región Metropolitana" },
  { id: 298, name: "Conchalí",           region: "Región Metropolitana" },
  { id: 318, name: "Pudahuel",            region: "Región Metropolitana" },
  { id: 306, name: "La Pintana",          region: "Región Metropolitana" },
  { id: 299, name: "El Bosque",           region: "Región Metropolitana" },
  { id: 325, name: "San Ramón",           region: "Región Metropolitana" },
  { id: 305, name: "La Granja",           region: "Región Metropolitana" },
  { id: 315, name: "Pedro Aguirre Cerda", region: "Región Metropolitana" },
  { id: 310, name: "Lo Espejo",           region: "Región Metropolitana" },
  { id: 334, name: "Buin",               region: "Región Metropolitana" },
  { id: 331, name: "Lampa",              region: "Región Metropolitana" },
  { id: 337, name: "Melipilla",           region: "Región Metropolitana" },
  { id: 342, name: "Talagante",           region: "Región Metropolitana" },
  // Valparaíso
  { id: 45,  name: "Valparaíso",         region: "Valparaíso" },
  { id: 51,  name: "Viña del Mar",        region: "Valparaíso" },
  { id: 67,  name: "San Antonio",         region: "Valparaíso" },
  { id: 46,  name: "Casablanca",          region: "Valparaíso" },
  { id: 68,  name: "Algarrobo",           region: "Valparaíso" },
  { id: 69,  name: "Cartagena",           region: "Valparaíso" },
  // Antofagasta
  { id: 12,  name: "Antofagasta",         region: "Antofagasta" },
  { id: 16,  name: "Calama",              region: "Antofagasta" },
  // Atacama
  { id: 21,  name: "Copiapó",            region: "Atacama" },
  // Coquimbo
  { id: 30,  name: "La Serena",           region: "Coquimbo" },
  { id: 31,  name: "Coquimbo",            region: "Coquimbo" },
  { id: 40,  name: "Ovalle",              region: "Coquimbo" },
  // O'Higgins
  { id: 83,  name: "Rancagua",            region: "O'Higgins" },
  // Maule
  { id: 116, name: "Talca",              region: "Maule" },
  { id: 129, name: "Curicó",             region: "Maule" },
  { id: 138, name: "Linares",             region: "Maule" },
  // Ñuble
  { id: 179, name: "Chillán",            region: "Ñuble" },
  // Biobío
  { id: 146, name: "Concepción",          region: "Biobío" },
  { id: 147, name: "Coronel",             region: "Biobío" },
  { id: 148, name: "Chiguayante",         region: "Biobío" },
  { id: 151, name: "Lota",               region: "Biobío" },
  { id: 165, name: "Los Ángeles",        region: "Biobío" },
  // La Araucanía
  { id: 200, name: "Temuco",              region: "La Araucanía" },
  // Los Ríos
  { id: 232, name: "Valdivia",            region: "Los Ríos" },
  // Los Lagos
  { id: 244, name: "Puerto Montt",        region: "Los Lagos" },
  { id: 263, name: "Osorno",              region: "Los Lagos" },
  // Magallanes
  { id: 284, name: "Punta Arenas",        region: "Magallanes" },
  // Tarapacá
  { id: 5,   name: "Iquique",             region: "Tarapacá" },
  // Arica y Parinacota
  { id: 1,   name: "Arica",              region: "Arica y Parinacota" },
  { id: 6,   name: "Alto Hospicio",       region: "Arica y Parinacota" },
];

const _normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function filterCommunes(query: string): ShipitCommune[] {
  if (!query.trim()) return [];
  const q = _normalize(query);
  return SHIPIT_COMMUNES.filter((c) => _normalize(c.name).includes(q)).slice(0, 8);
}
