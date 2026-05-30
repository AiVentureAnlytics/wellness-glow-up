export const config = { runtime: "edge" };

const MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";
const APP_URL = "https://levelupp.cl";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return json({ error: "MP_ACCESS_TOKEN not configured" }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json() as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // Strip payer — passing payer.email causes MP to load that account's saved cards
  // into every checkout session, leaking payment methods across users.
  const { payer: _payer, ...safeBody } = body;

  // Inject back_urls and auto_return server-side — clients must not override these
  const preference = {
    ...safeBody,
    back_urls: {
      success: `${APP_URL}/pago/exito`,
      failure: `${APP_URL}/pago/error`,
      pending: `${APP_URL}/pago/pendiente`,
    },
    auto_return: "approved",
  };

  console.log("[MP] preference payload:", JSON.stringify(preference, null, 2));

  const mpRes = await fetch(MP_PREFERENCES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(preference),
  });

  const data = await mpRes.json() as Record<string, unknown>;

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
