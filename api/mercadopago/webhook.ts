export const config = { runtime: "edge" };

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

  const payment = (await payRes.json()) as { status: string; external_reference: string | null };

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

  return json({ ok: true, orderId });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
