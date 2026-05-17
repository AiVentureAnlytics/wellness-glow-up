export const config = { runtime: "edge" };

const MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return json({ error: "MP_ACCESS_TOKEN not configured" }, 500);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const mpRes = await fetch(MP_PREFERENCES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
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
