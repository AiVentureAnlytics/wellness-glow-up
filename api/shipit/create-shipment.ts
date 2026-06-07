export const config = { runtime: "edge" };

import { Resend } from "resend";

const SHIPIT_RATES_URL = "https://api.shipit.cl/v/rates";
const SHIPIT_SHIPMENTS_URL = "https://api.shipit.cl/v/1.1/shipments";
const SHIPIT_ORIGIN_ID = 326; // Vitacura
const DEFAULT_WEIGHT_KG = 0.5;

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
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
    `${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=id,customer_name,customer_email,customer_phone,customer_address,shipping_commune_id,shipping_commune_name`,
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
  const parts = (order.customer_address ?? "").split(",").map((s) => s.trim());
  const street = parts[0] ?? order.customer_address ?? "";
  const number = parts[1] ?? "S/N";
  const complement = parts.slice(2).join(", ");

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
            street,
            number,
            complement,
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
  void sendShippingEmail({
    orderId: order.id,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    trackingUrl,
    courierName,
  }).catch((err) => console.error("[create-shipment] Shipping email failed (non-fatal):", err));

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

async function sendShippingEmail({
  orderId,
  customerName,
  customerEmail,
  trackingUrl,
  courierName,
}: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  trackingUrl: string;
  courierName: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL ?? "Level Up <onboarding@resend.dev>";
  const shortId = orderId.slice(0, 8).toUpperCase();
  const safeName = customerName
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tu pedido está en camino</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto 48px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">

    <div style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 100%);padding:36px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-.3px;">Level Up</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:13px;">Suplementos · Wellness · Wearables · Chile 🇨🇱</p>
    </div>

    <div style="padding:40px;">
      <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111;">¡Tu pedido está en camino! 🚚</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#555;">Hola <strong>${safeName}</strong>, tu pedido <strong>#${shortId}</strong> ha sido despachado y está en camino.</p>

      <div style="text-align:center;margin-bottom:28px;">
        <a href="${trackingUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:600;font-size:15px;">
          Rastrear mi envío →
        </a>
      </div>

      <div style="background:#f9fafb;border-radius:10px;padding:14px 20px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#6b7280;">Despachado por <strong style="color:#111;">${courierName}</strong></p>
      </div>
    </div>

    <div style="background:#f9fafb;border-top:1px solid #f0f0f0;padding:20px 40px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 Level Up · Despacho a todo Chile</p>
    </div>
  </div>
</body>
</html>`;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: customerEmail,
    subject: "Tu pedido está en camino 🚚",
    html,
  });
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
