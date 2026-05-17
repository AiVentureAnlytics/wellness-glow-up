// CJ Health Supply — Catálogo de productos (full Supabase)
//
// Toda la data viene de la tabla `products` en Supabase.
// Para agregar/editar/borrar productos: usa el Table Editor de Supabase
// o sube imágenes al bucket `product-images`.

export type Category =
  | "proteinas"
  | "creatinas"
  | "vitaminas"
  | "energia"
  | "wellness"
  | "wearables";

export type Section = "Suplementos" | "Wellness" | "Wearables";

export interface Product {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  img: string;
  description: string;
  details: string[];
  category: Category;
  section: Section;
  badge?: string;
  stock: number;
}

// Re-export las funciones de DB para que las páginas usen la API limpia
export {
  listDbProducts as fetchAllProducts,
  getDbProduct as fetchProduct,
} from "./dbProducts";

export function formatCLP(num: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(num);
}

