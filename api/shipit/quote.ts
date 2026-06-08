export const config = { runtime: "edge" };

const SHIPIT_RATES_URL = "https://api.shipit.cl/v/rates";
const SHIPIT_ORIGIN_ID = 326; // Vitacura
const DEFAULT_WEIGHT_KG = 0.5;

const FALLBACK_QUOTES = {
  quotes: [{ courierName: null, price: 3000, deliveryDate: null, days: null }],
};

interface RequestBody {
  commune_id: number;
  items: Array<{ id: string; quantity: number }>;
}

interface DbProduct {
  id: string;
  weight_kg: number | null;
}

interface ShipitPrice {
  price: number;
  available_to_shipping: boolean;
  courier: { name: string };
  name: string;   // human-readable delivery date, e.g. "Martes, 09 De Junio"
  days: number;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return json({ error: "Supabase not configured" }, 500);

  let body: RequestBody;
  try {
    const raw = (await req.json()) as Record<string, unknown>;
    const communeId = raw.commune_id;
    const items = raw.items;

    if (typeof communeId !== "number" || !Number.isInteger(communeId) || communeId <= 0) {
      return json({ error: "commune_id must be a positive integer" }, 400);
    }
    if (!Array.isArray(items) || items.length === 0) {
      return json({ error: "items must be a non-empty array" }, 400);
    }

    const parsedItems: Array<{ id: string; quantity: number }> = [];
    for (const item of items as Array<Record<string, unknown>>) {
      if (!item.id || typeof item.id !== "string" || !/^[\w-]+$/.test(item.id)) {
        return json({ error: `Invalid product ID: ${String(item.id)}` }, 400);
      }
      const qty = Math.max(1, Math.floor(Number(item.quantity)));
      parsedItems.push({ id: item.id, quantity: qty });
    }

    body = { commune_id: communeId, items: parsedItems };
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // Fetch weight_kg for all requested products in one query
  const productIds = body.items.map((i) => i.id).join(",");
  const dbRes = await fetch(
    `${supabaseUrl}/rest/v1/products?id=in.(${productIds})&select=id,weight_kg`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );
  if (!dbRes.ok) return json({ error: "Failed to fetch product data" }, 502);

  const dbProducts = (await dbRes.json()) as DbProduct[];
  const weightMap = new Map<string, number>(
    dbProducts.map((p) => [p.id, p.weight_kg ?? DEFAULT_WEIGHT_KG])
  );

  let totalWeight = 0;
  for (const item of body.items) {
    const weight = weightMap.get(item.id) ?? DEFAULT_WEIGHT_KG;
    totalWeight += item.quantity * weight;
  }

  // Call Shipit rates API; fall back gracefully on any failure
  const shipitEmail = process.env.SHIPIT_EMAIL;
  const shipitToken = process.env.SHIPIT_TOKEN;
  if (!shipitEmail || !shipitToken) return json(FALLBACK_QUOTES);

  let shipitData: unknown;
  try {
    const shipitRes = await fetch(SHIPIT_RATES_URL, {
      method: "POST",
      headers: {
        "X-Shipit-Email": shipitEmail,
        "X-Shipit-Access-Token": shipitToken,
        "Content-Type": "application/json",
        Accept: "application/vnd.shipit.v4",
      },
      body: JSON.stringify({
        parcel: {
          length: 30,
          height: 30,
          width: 30,
          weight: totalWeight,
          origin_id: SHIPIT_ORIGIN_ID,
          destiny_id: body.commune_id,
          type_of_destiny: "domicilio",
        },
      }),
    });

    if (!shipitRes.ok) return json(FALLBACK_QUOTES);
    shipitData = await shipitRes.json();
  } catch {
    return json(FALLBACK_QUOTES);
  }

  const NEARBY_COMMUNES = new Set([308, 309, 326]); // Las Condes, Lo Barnechea, Vitacura
  const NEARBY_PRICE = 2990;

  let quotes = extractQuotes(shipitData);

  if (NEARBY_COMMUNES.has(body.commune_id)) {
    quotes = quotes.map((q) => ({ ...q, price: NEARBY_PRICE }));
  }

  return json(quotes.length > 0 ? { quotes } : FALLBACK_QUOTES);
}

function extractQuotes(data: unknown) {
  const prices: ShipitPrice[] = Array.isArray(data)
    ? (data as ShipitPrice[])
    : Array.isArray((data as Record<string, unknown>)?.prices)
      ? ((data as Record<string, unknown>).prices as ShipitPrice[])
      : [];

  return prices
    .filter((p) => p.available_to_shipping === true)
    .sort((a, b) => a.price - b.price)
    .map((p) => ({
      courierName: p.courier?.name ?? null,
      price: p.price,
      deliveryDate: p.name ?? null,
      days: p.days ?? null,
    }));
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
