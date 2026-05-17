// CJ Health Supply — Capa de acceso a Supabase para productos
// Tabla: products  ·  Bucket: product-images

import { supabase } from "./supabase";
import type { Category, Product } from "./products";

export interface DbProduct {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  details: string[];
  price: number;
  img: string;
  category: Category;
  section: "Suplementos" | "Wellness" | "Wearables";
  badge: string | null;
  active: boolean;
  stock: number;
}

/** Adapta una fila de DB al tipo Product que ya usa la UI */
export function dbToProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    priceLabel: new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(row.price),
    img: row.img,
    description: row.description ?? "",
    details: Array.isArray(row.details) ? row.details : [],
    category: row.category,
    section: row.section,
    badge: row.badge ?? undefined,
    stock: row.stock ?? 0,
  };
}

export async function listDbProducts(opts?: { onlyActive?: boolean }): Promise<Product[]> {
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (opts?.onlyActive !== false) {
    query = query.eq("active", true);
  }
  const { data, error } = await query;
  if (error) {
    // eslint-disable-next-line no-console
    console.warn("listDbProducts error:", error.message);
    return [];
  }
  return (data ?? []).map(dbToProduct);
}

export async function getDbProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return dbToProduct(data as DbProduct);
}

export interface ProductInput {
  id: string;
  name: string;
  description: string;
  details: string[];
  price: number;
  img: string;
  category: Category;
  section: "Suplementos" | "Wellness" | "Wearables";
  badge?: string;
  active?: boolean;
  stock?: number;
}

export async function createDbProduct(input: ProductInput): Promise<DbProduct> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      id: input.id,
      name: input.name,
      description: input.description,
      details: input.details,
      price: input.price,
      img: input.img,
      category: input.category,
      section: input.section,
      badge: input.badge ?? null,
      active: input.active ?? true,
      stock: input.stock ?? 999,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DbProduct;
}

export async function updateDbProduct(id: string, patch: Partial<ProductInput>): Promise<DbProduct> {
  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DbProduct;
}

export async function deleteDbProduct(id: string): Promise<void> {
  // Soft-delete: marcamos active=false en vez de borrar
  const { error } = await supabase.from("products").update({ active: false }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function hardDeleteDbProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Sube una imagen al bucket "product-images" y retorna la URL pública.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filename, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) throw new Error(`Error subiendo imagen: ${error.message}`);

  const { data } = supabase.storage.from("product-images").getPublicUrl(filename);
  return data.publicUrl;
}

/** Sube múltiples imágenes en paralelo, devuelve sus URLs en el mismo orden */
export async function uploadProductImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadProductImage));
}

/** Genera un slug ID a partir del nombre */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}
