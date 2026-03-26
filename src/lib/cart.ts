export interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  qty: number;
}

const STORAGE_KEY = "vitrax_cart";

export function getCart(): CartItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(id: string, name: string, price: number, img: string, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, img, qty });
  }
  saveCart(cart);
}

export function removeFromCart(id: string) {
  saveCart(getCart().filter((i) => i.id !== id));
}

export function changeQuantity(id: string, delta: number) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
  }
}

export function getCartTotal(cart: CartItem[]) {
  return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
}

export function getCartCount(cart: CartItem[]) {
  return cart.reduce((acc, item) => acc + item.qty, 0);
}

export function formatCLP(num: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(num);
}
