import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, fetchProduct, type Product, type Section } from "@/lib/products";

/** Carga todos los productos desde Supabase (con cache de 60s) */
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchAllProducts({ onlyActive: true }),
    staleTime: 60_000,
  });
}

/** Filtra productos por sección (Suplementos/Wellness/Wearables) */
export function useProductsBySection(section: Section) {
  const q = useProducts();
  return {
    ...q,
    data: q.data?.filter((p) => p.section === section) ?? [],
  };
}

/** Carga un producto específico por ID */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => (id ? fetchProduct(id) : Promise.resolve(null)),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export type { Product, Section };
