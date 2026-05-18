import { supabase } from "./supabase";
import type { CartItem } from "./cart";

export interface StockError {
  productId: string;
  productName: string;
  requested: number;
  available: number;
}

/**
 * Queries current stock for every cart item in a single request.
 * Returns an array of errors for items that don't have enough stock.
 * Throws if the DB query itself fails.
 */
export async function validateCartStock(cart: CartItem[]): Promise<StockError[]> {
  if (cart.length === 0) return [];

  const ids = cart.map((item) => item.id);
  const { data, error } = await supabase
    .from("products")
    .select("id, name, stock")
    .in("id", ids);

  if (error) throw new Error(error.message);

  const stockMap = new Map<string, { name: string; stock: number }>(
    (data ?? []).map((row) => [row.id as string, { name: row.name as string, stock: row.stock as number }])
  );

  const errors: StockError[] = [];
  for (const item of cart) {
    const product = stockMap.get(item.id);
    const available = product?.stock ?? 0;
    if (available < item.qty) {
      errors.push({
        productId: item.id,
        productName: product?.name ?? item.name,
        requested: item.qty,
        available,
      });
    }
  }
  return errors;
}
