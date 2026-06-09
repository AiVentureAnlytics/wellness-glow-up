export const config = { runtime: "edge" };

import { createClient } from "@supabase/supabase-js";

type ShipitStatus = "entregado" | "en_camino";

function mapStatus(raw: string): ShipitStatus | null {
  if (raw === "delivered") return "entregado";
  if (raw === "in_transit" || raw === "out_for_delivery") return "en_camino";
  return null;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ received: true });

  const shipitSecret = process.env.SHIPIT_WEBHOOK_SECRET;
  if (!shipitSecret) return json({ error: "not configured" }, 500);
  if (req.headers.get("x-shipit-secret") !== shipitSecret) return json({ error: "unauthorized" }, 401);

  let body: { id: number; status: string; reference: string };
  try {
    body = (await req.json()) as { id: number; status: string; reference: string };
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const mappedStatus = mapStatus(body.status);
  if (!mappedStatus) return json({ received: true });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Supabase env vars not configured" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  await supabase
    .from("orders")
    .update({ status: mappedStatus })
    .eq("shipit_id", body.id)
    .neq("status", "entregado");

  return json({ received: true });
}
