import { useEffect, useState, useCallback } from "react";
import { getCart, CartItem } from "@/lib/cart";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(getCart);

  const refresh = useCallback(() => setCart(getCart()), []);

  useEffect(() => {
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, [refresh]);

  return cart;
}
