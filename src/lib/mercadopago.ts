import { CartItem } from "./cart";

const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY as string | undefined;

export interface MPPreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: "CLP";
}

export interface MPPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export async function createPreference(args: {
  cart: CartItem[];
  customer: { name: string; email: string; phone: string; address: string };
  orderId: string;
}): Promise<MPPreference> {
  const items: MPPreferenceItem[] = args.cart.map((item) => ({
    id: item.id,
    title: item.name,
    quantity: item.qty,
    unit_price: item.price,
    currency_id: "CLP",
  }));

  const res = await fetch("/api/mercadopago/create-preference", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      payer: {
        name: args.customer.name,
        email: args.customer.email,
        phone: { number: args.customer.phone },
        address: { street_name: args.customer.address },
      },
      external_reference: args.orderId,
      notification_url: `${window.location.origin}/api/mercadopago/webhook`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? `Error ${res.status} al crear preferencia de pago`
    );
  }

  return res.json() as Promise<MPPreference>;
}

export function isMPConfigured(): boolean {
  return Boolean(MP_PUBLIC_KEY);
}

/** Returns true when using TEST credentials — use sandbox_init_point in that case */
export function isMPTestMode(): boolean {
  return MP_PUBLIC_KEY?.startsWith("TEST-") ?? false;
}
