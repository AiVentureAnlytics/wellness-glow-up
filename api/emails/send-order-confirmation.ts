export const config = { runtime: "edge" };

import { sendOrderEmails, type OrderEmailData } from "../_lib/emails";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // Require internal secret to prevent unauthorized email sends
  const internalSecret = process.env.INTERNAL_EMAIL_SECRET;
  if (!internalSecret) return json({ error: "INTERNAL_EMAIL_SECRET not configured" }, 500);
  if (req.headers.get("x-internal-secret") !== internalSecret) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const data = body as Partial<OrderEmailData>;
  if (
    !data.orderId ||
    !data.customer?.email ||
    !data.customer?.name ||
    !Array.isArray(data.items) ||
    typeof data.total !== "number" ||
    !data.paymentMethod
  ) {
    return json({ error: "Missing required fields" }, 400);
  }

  try {
    await sendOrderEmails(data as OrderEmailData);
    return json({ ok: true });
  } catch (err) {
    console.error("[send-order-confirmation] Error:", err);
    return json({ error: "Email send failed" }, 500);
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
