export const config = { runtime: "edge" };

const SHIPIT_RATES_URL = "https://api.shipit.cl/v/rates";
const SHIPIT_SHIPMENTS_URL = "https://api.shipit.cl/v/1.1/shipments";
const SHIPIT_ORIGIN_ID = 326; // Vitacura
const DEFAULT_WEIGHT_KG = 0.5;

interface ShippingAddress {
  street: string;
  number: string;
  complement?: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  shipping_commune_id: number;
  shipping_commune_name: string;
}

interface OrderItem {
  product_id: string;
  quantity: number;
}

interface DbProduct {
  id: string;
  weight_kg: number | null;
}

interface ShipitPrice {
  price: number;
  available_to_shipping: boolean;
  courier: { name: string };
}

interface ShipitRatesResponse {
  prices?: ShipitPrice[];
}

interface ShipitShipmentResponse {
  shipment?: {
    id: number;
    tracking_url?: string;
  };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return fail("Method not allowed", 405);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const shipitEmail = process.env.SHIPIT_EMAIL;
  const shipitToken = process.env.SHIPIT_TOKEN;

  if (!supabaseUrl || !supabaseKey) return fail("Supabase not configured", 500);
  if (!shipitEmail || !shipitToken) return fail("Shipit not configured", 500);

  // ── 1. Parse and validate request body ──────────────────────────────────
  let orderId: string;
  try {
    const raw = (await req.json()) as Record<string, unknown>;
    if (!raw.order_id || typeof raw.order_id !== "string") {
      return fail("order_id is required", 400);
    }
    if (!/^[0-9a-f-]{36}$/i.test(raw.order_id)) {
      return fail("order_id must be a valid UUID", 400);
    }
    orderId = raw.order_id;
  } catch {
    return fail("Invalid JSON body", 400);
  }

  const authHeaders = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
  };

  // ── 2. Fetch order ───────────────────────────────────────────────────────
  const orderRes = await fetch(
    `${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=id,customer_name,customer_email,customer_phone,shipping_address,shipping_commune_id,shipping_commune_name`,
    { headers: authHeaders }
  );
  if (!orderRes.ok) return fail("Failed to fetch order", 502);

  const orderRows = (await orderRes.json()) as Order[];
  if (!orderRows[0]) return fail("Order not found", 404);
  const order = orderRows[0];

  // ── 3. Fetch order items ─────────────────────────────────────────────────
  const itemsRes = await fetch(
    `${supabaseUrl}/rest/v1/order_items?order_id=eq.${orderId}&select=product_id,quantity`,
    { headers: authHeaders }
  );
  if (!itemsRes.ok) return fail("Failed to fetch order items", 502);

  const orderItems = (await itemsRes.json()) as OrderItem[];
  if (!orderItems.length) return fail("Order has no items", 400);

  // ── 4. Fetch product weights ─────────────────────────────────────────────
  const productIds = orderItems.map((i) => i.product_id).join(",");
  const productsRes = await fetch(
    `${supabaseUrl}/rest/v1/products?id=in.(${productIds})&select=id,weight_kg`,
    { headers: authHeaders }
  );
  if (!productsRes.ok) return fail("Failed to fetch product weights", 502);

  const dbProducts = (await productsRes.json()) as DbProduct[];
  const weightMap = new Map<string, number>(
    dbProducts.map((p) => [p.id, p.weight_kg ?? DEFAULT_WEIGHT_KG])
  );

  // ── 5. Calculate total weight and item count ─────────────────────────────
  let totalWeight = 0;
  let totalItems = 0;
  for (const item of orderItems) {
    totalWeight += item.quantity * (weightMap.get(item.product_id) ?? DEFAULT_WEIGHT_KG);
    totalItems += item.quantity;
  }

  // ── 6. Get cheapest courier via Shipit rates ─────────────────────────────
  let courierName: string;
  try {
    const ratesRes = await fetch(SHIPIT_RATES_URL, {
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
          destiny_id: order.shipping_commune_id,
          type_of_destiny: "domicilio",
        },
      }),
    });

    if (!ratesRes.ok) return fail("Shipit rates request failed", 502);

    const ratesData = (await ratesRes.json()) as ShipitRatesResponse;
    const available = (ratesData.prices ?? []).filter((p) => p.available_to_shipping === true);
    if (!available.length) return fail("No available couriers for this commune", 422);

    available.sort((a, b) => a.price - b.price);
    courierName = available[0].courier.name;
  } catch (err) {
    return fail(`Shipit rates error: ${String(err)}`, 502);
  }

  // ── 7. Create shipment ───────────────────────────────────────────────────
  let shipitId: number;
  let trackingUrl: string;
  try {
    const shipmentRes = await fetch(SHIPIT_SHIPMENTS_URL, {
      method: "POST",
      headers: {
        "X-Shipit-Email": shipitEmail,
        "X-Shipit-Access-Token": shipitToken,
        "Content-Type": "application/json",
        Accept: "application/vnd.shipit.v4",
      },
      body: JSON.stringify({
        shipment: {
          reference: orderId,
          items: totalItems,
          sizes: {
            width: 30,
            height: 30,
            length: 30,
            weight: totalWeight,
          },
          courier: {
            client: courierName,
          },
          destiny: {
            street: order.shipping_address.street,
            number: order.shipping_address.number,
            complement: order.shipping_address.complement ?? "",
            commune_id: order.shipping_commune_id,
            commune_name: order.shipping_commune_name,
            full_name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            kind: "home_delivery",
          },
        },
      }),
    });

    if (!shipmentRes.ok) {
      const errText = await shipmentRes.text();
      return fail(`Shipit shipment creation failed: ${errText}`, 502);
    }

    const shipmentData = (await shipmentRes.json()) as ShipitShipmentResponse;
    if (!shipmentData.shipment?.id) {
      return fail("Shipit response missing shipment.id", 502);
    }

    shipitId = shipmentData.shipment.id;
    trackingUrl = shipmentData.shipment.tracking_url ?? "";
  } catch (err) {
    return fail(`Shipit shipment error: ${String(err)}`, 502);
  }

  // ── 8. Persist shipit_id and tracking_url on the order ──────────────────
  const patchRes = await fetch(
    `${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`,
    {
      method: "PATCH",
      headers: { ...authHeaders, Prefer: "return=minimal" },
      body: JSON.stringify({ shipit_id: shipitId, tracking_url: trackingUrl }),
    }
  );
  if (!patchRes.ok) {
    // Shipment was created — return success but surface the persist failure
    const errText = await patchRes.text();
    return json({
      success: true,
      shipit_id: shipitId,
      tracking_url: trackingUrl,
      warning: `Order patch failed: ${errText}`,
    });
  }

  return json({ success: true, shipit_id: shipitId, tracking_url: trackingUrl });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function fail(error: string, status = 500): Response {
  return json({ success: false, error }, status);
}
