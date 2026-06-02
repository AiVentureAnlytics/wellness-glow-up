export const config = { runtime: "edge" };

const MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";
const APP_URL = "https://levelupp.cl";

interface ClientItem {
  id: string;
  title: string;
  quantity: number;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return json({ error: "MP_ACCESS_TOKEN not configured" }, 500);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return json({ error: "Supabase not configured" }, 500);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const clientItems = (body.items ?? []) as ClientItem[];
  if (!Array.isArray(clientItems) || clientItems.length === 0) {
    return json({ error: "No items provided" }, 400);
  }

  // "envio" is a virtual shipping item — not in products table
  const productItems = clientItems.filter((i) => i.id !== "envio");
  const hasShipping = clientItems.some((i) => i.id === "envio");

  // Validate product IDs are safe slugs (word chars + hyphens only)
  for (const item of productItems) {
    if (!item.id || !/^[\w-]+$/.test(String(item.id))) {
      return json({ error: `Invalid product ID: ${item.id}` }, 400);
    }
  }

  // Fetch authoritative prices from DB — never trust client-supplied unit_price
  const productIds = productItems.map((i) => String(i.id)).join(",");
  const priceRes = await fetch(
    `${supabaseUrl}/rest/v1/products?id=in.(${productIds})&select=id,price,active`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );
  if (!priceRes.ok) return json({ error: "Failed to fetch product prices" }, 502);

  const dbProducts = (await priceRes.json()) as Array<{
    id: string;
    price: number;
    active: boolean;
  }>;

  const items = [];
  for (const clientItem of productItems) {
    const product = dbProducts.find((p) => p.id === clientItem.id);
    if (!product || !product.active) {
      return json({ error: `Product not found or inactive: ${clientItem.id}` }, 400);
    }
    items.push({
      id: clientItem.id,
      title: String(clientItem.title),
      quantity: Math.max(1, Math.floor(Number(clientItem.quantity))),
      unit_price: product.price, // authoritative price from DB
      currency_id: "CLP",
    });
  }

  // Calculate shipping server-side: free above $40.000, otherwise $3.000
  const productSubtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  if (hasShipping) {
    const shippingPrice = productSubtotal >= 40000 ? 0 : 3000;
    if (shippingPrice > 0) {
      items.push({
        id: "envio",
        title: "Envío",
        quantity: 1,
        unit_price: shippingPrice,
        currency_id: "CLP",
      });
    }
  }

  // Recalculate total server-side and patch the order so DB matches what MP will charge
  const serverTotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const orderId = body.external_reference as string | undefined;
  if (orderId && /^[0-9a-f-]{36}$/i.test(orderId)) {
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ total: serverTotal }),
    });
  }

  // Strip payer and client items; inject server-validated items + back_urls
  const { payer: _payer, items: _items, ...safeBody } = body;

  const preference = {
    ...safeBody,
    items,
    notification_url: `${APP_URL}/api/mercadopago/webhook`,
    back_urls: {
      success: `${APP_URL}/pago/exito`,
      failure: `${APP_URL}/pago/error`,
      pending: `${APP_URL}/pago/pendiente`,
    },
    auto_return: "approved",
  };

  const mpRes = await fetch(MP_PREFERENCES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(preference),
  });

  const data = (await mpRes.json()) as Record<string, unknown>;

  if (!mpRes.ok) {
    return json({ error: data.message ?? data }, mpRes.status);
  }

  return json({
    id: data.id,
    init_point: data.init_point,
    sandbox_init_point: data.sandbox_init_point,
  });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
