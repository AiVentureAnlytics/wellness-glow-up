export const config = { runtime: "edge" };

const SHIPIT_COMMUNES_URL = "https://api.shipit.cl/v/communes";

interface ShipitApiCommune {
  id: number;
  name: string;
  country_id: number;
  is_available?: boolean;
}

function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const email = process.env.SHIPIT_EMAIL;
  const token = process.env.SHIPIT_TOKEN;
  if (!email || !token) return json({ error: "Shipit not configured" }, 500);

  let data: ShipitApiCommune[];
  try {
    const res = await fetch(SHIPIT_COMMUNES_URL, {
      headers: {
        "X-Shipit-Email": email,
        "X-Shipit-Access-Token": token,
        Accept: "application/vnd.shipit.v4",
      },
    });
    if (!res.ok) return json({ error: "Shipit communes fetch failed" }, 502);
    data = (await res.json()) as ShipitApiCommune[];
  } catch {
    return json({ error: "Failed to fetch communes" }, 502);
  }

  const communes = data
    .filter((c) => c.country_id === 1 && c.is_available !== false)
    .map((c) => ({ id: c.id, name: toTitleCase(c.name) }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return new Response(JSON.stringify(communes), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
