export const config = { runtime: "edge" };

import { sendOrderEmails } from "../_lib/emails";

const MP_API_BASE = "https://api.mercadopago.com";

export default async function handler(req: Request): Promise<Response> {
  // MP sometimes sends GET to verify the endpoint is reachable
  if (req.method !== "POST") return json({ ok: true });

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return json({ error: "MP_ACCESS_TOKEN not configured" }, 500);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // HMAC signature verification (optional — only when MP_WEBHOOK_SECRET is set)
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (secret) {
    const signature = req.headers.get("x-signature") ?? "";
    const requestId = req.headers.get("x-request-id") ?? "";
    const dataId = (body.data as { id?: string } | undefined)?.id ?? "";

    const parts = Object.fromEntries(
      signature.split(",").flatMap((part) => {
        const [k, ...v] = part.split("=");
        return k ? [[k.trim(), v.join("=").trim()]] : [];
      })
    ) as Record<string, string>;
    const ts = parts.ts ?? "";
    const v1 = parts.v1 ?? "";

    const template = `id:${dataId};request-id:${requestId};ts:${ts};`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(template));
    const expected = Array.from(new Uint8Array(sigBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expected !== v1) return json({ error: "Invalid signature" }, 401);
  }

  // Only process payment events
  if ((body.type as string) !== "payment") return json({ ok: true });

  const paymentId = (body.data as { id?: string } | undefined)?.id;
  if (!paymentId) return json({ error: "Missing payment ID" }, 400);

  // Fetch payment details from MP API
  const payRes = await fetch(`${MP_API_BASE}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!payRes.ok) return json({ error: "MP payment fetch failed" }, 502);

  const payment = (await payRes.json()) as {
    status: string;
    external_reference: string | null;
    transaction_amount: number;
  };

  // Only act on approved payments
  if (payment.status !== "approved") return json({ ok: true, skipped: payment.status });

  const orderId = payment.external_reference;
  if (!orderId) return json({ error: "Payment has no external_reference" }, 400);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return json({ error: "Supabase not configured" }, 500);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${supabaseKey}`,
    apikey: supabaseKey,
  };

  // Verify paid amount matches order total before committing any changes
  const orderCheckRes = await fetch(
    `${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=total`,
    { headers: authHeaders }
  );
  if (!orderCheckRes.ok) return json({ error: "Failed to fetch order for verification" }, 502);
  const orderRows = (await orderCheckRes.json()) as Array<{ total: number }>;
  if (!orderRows[0]) return json({ error: "Order not found" }, 404);
  if (Math.abs(Math.round(payment.transaction_amount) - orderRows[0].total) > 1) {
    return json({ error: "Payment amount mismatch" }, 400);
  }

  // Update order status to "verificado"
  const updateRes = await fetch(
    `${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`,
    {
      method: "PATCH",
      headers: { ...authHeaders, Prefer: "return=minimal" },
      body: JSON.stringify({ status: "verificado" }),
    }
  );
  if (!updateRes.ok) {
    const err = await updateRes.text();
    return json({ error: `Order update failed: ${err}` }, 502);
  }

  // Fire and forget — create Shipit shipment
  const shipitUrl = new URL("/api/shipit/create-shipment", req.url).toString();
  fetch(shipitUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId }),
  }).catch(() => {}); // never block webhook response

  // Decrement stock via idempotent SECURITY DEFINER RPC
  const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/decrement_order_stocks`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ p_order_id: orderId }),
  });
  if (!rpcRes.ok) {
    const err = await rpcRes.text();
    return json({ error: `Stock decrement failed: ${err}` }, 502);
  }

  // Fetch order + items for email (non-critical — never fail the webhook on email error)
  try {
    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=customer_name,customer_email,customer_phone,customer_address,total,payment_method,order_items(product_name,qty,price)`,
      { headers: authHeaders }
    );
    if (orderRes.ok) {
      const rows = (await orderRes.json()) as Array<{
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        customer_address: string;
        total: number;
        payment_method: string;
        order_items: Array<{ product_name: string; qty: number; price: number }>;
      }>;
      const row = rows[0];
      if (row) {
        await sendOrderEmails({
          orderId,
          customer: {
            name: row.customer_name,
            email: row.customer_email,
            phone: row.customer_phone,
            address: row.customer_address,
          },
          items: row.order_items,
          total: row.total,
          paymentMethod: row.payment_method as "mercadopago" | "transferencia",
        });
      }
    }
  } catch (err) {
    console.error("[webhook] Email send failed (non-fatal):", err);
  }

  return json({ ok: true, orderId });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
