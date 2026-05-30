import { Resend } from "resend";

const APP_URL = "https://levelupp.cl";
const ADMIN_EMAIL = "cjhealthsupply@gmail.com";

export interface OrderEmailData {
  orderId: string;
  customer: { name: string; email: string; phone: string; address: string };
  items: Array<{ product_name: string; qty: number; price: number }>;
  total: number;
  paymentMethod: "mercadopago" | "transferencia";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clp(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Sends customer confirmation + admin notification emails for a confirmed order.
 * Uses Promise.allSettled so one failure never blocks the other.
 * Silently skips if RESEND_API_KEY is not set.
 */
export async function sendOrderEmails(data: OrderEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[emails] RESEND_API_KEY not set — skipping");
    return;
  }

  const resend = new Resend(apiKey);
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Level Up <onboarding@resend.dev>";

  const { orderId, customer, items, total, paymentMethod } = data;
  const shortId = orderId.slice(0, 8).toUpperCase();
  const orderUrl = `${APP_URL}/orden/${orderId}`;
  const paymentLabel =
    paymentMethod === "mercadopago" ? "MercadoPago" : "Transferencia bancaria";

  const safeName = escapeHtml(customer.name);
  const safeEmail = escapeHtml(customer.email);
  const safePhone = escapeHtml(customer.phone);
  const safeAddress = escapeHtml(customer.address);

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">${escapeHtml(item.product_name)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:center;">${item.qty}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:right;font-weight:600;">${clp(item.price * item.qty)}</td>
        </tr>`
    )
    .join("");

  const customerHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Confirmación de pedido</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto 48px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 100%);padding:36px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-.3px;">Level Up</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:13px;">Suplementos · Wellness · Wearables · Chile 🇨🇱</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111;">¡Tu pedido está confirmado!</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#555;">Hola <strong>${safeName}</strong>, recibimos tu orden correctamente.</p>

      <!-- Order ID chip -->
      <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:10px;padding:14px 20px;margin-bottom:28px;display:inline-block;">
        <p style="margin:0;font-size:12px;color:#9061f9;font-weight:600;letter-spacing:.5px;text-transform:uppercase;">Número de orden</p>
        <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#7c3aed;letter-spacing:.5px;">#${shortId}</p>
      </div>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <thead>
          <tr style="border-bottom:2px solid #e5e7eb;">
            <th style="text-align:left;padding:8px 0;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Producto</th>
            <th style="text-align:center;padding:8px 0;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Cant.</th>
            <th style="text-align:right;padding:8px 0;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Total -->
      <div style="text-align:right;padding:16px 0 28px;border-top:2px solid #e5e7eb;">
        <span style="font-size:13px;color:#9ca3af;">Total pagado</span>
        <span style="font-size:26px;font-weight:700;color:#7c3aed;margin-left:12px;">${clp(total)}</span>
      </div>

      <!-- Info grid -->
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden;margin-bottom:32px;">
        <tr>
          <td style="padding:12px 18px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;white-space:nowrap;">Método de pago</td>
          <td style="padding:12px 18px;font-size:13px;font-weight:600;color:#111;border-bottom:1px solid #f0f0f0;">${paymentLabel}</td>
        </tr>
        <tr>
          <td style="padding:12px 18px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;white-space:nowrap;">Dirección</td>
          <td style="padding:12px 18px;font-size:13px;font-weight:600;color:#111;border-bottom:1px solid #f0f0f0;">${safeAddress}</td>
        </tr>
        <tr>
          <td style="padding:12px 18px;font-size:13px;color:#6b7280;white-space:nowrap;">Entrega estimada</td>
          <td style="padding:12px 18px;font-size:13px;font-weight:600;color:#111;">3–5 días hábiles</td>
        </tr>
      </table>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${orderUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:600;font-size:15px;">
          Ver mi orden →
        </a>
      </div>

      <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
        ¿Preguntas? Escríbenos a
        <a href="mailto:${ADMIN_EMAIL}" style="color:#7c3aed;text-decoration:none;">${ADMIN_EMAIL}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #f0f0f0;padding:20px 40px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 Level Up · Despacho a todo Chile</p>
    </div>
  </div>
</body>
</html>`;

  const adminHtml = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:32px auto;color:#111;">

  <h2 style="margin:0 0 4px;color:#7c3aed;">Nueva venta — Orden #${shortId}</h2>
  <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">Recibida el ${new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" })}</p>

  <!-- Customer info -->
  <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden;margin-bottom:24px;">
    <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #eee;white-space:nowrap;width:30%;">Cliente</td><td style="padding:10px 16px;font-size:13px;font-weight:600;border-bottom:1px solid #eee;">${safeName}</td></tr>
    <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #eee;">Email</td><td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #eee;"><a href="mailto:${safeEmail}" style="color:#7c3aed;">${safeEmail}</a></td></tr>
    <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #eee;">Teléfono</td><td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #eee;">${safePhone}</td></tr>
    <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #eee;">Dirección</td><td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #eee;">${safeAddress}</td></tr>
    <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #eee;">Pago</td><td style="padding:10px 16px;font-size:13px;font-weight:600;border-bottom:1px solid #eee;">${paymentLabel}</td></tr>
    <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;">Total</td><td style="padding:10px 16px;font-size:20px;font-weight:700;color:#7c3aed;">${clp(total)}</td></tr>
  </table>

  <!-- Items -->
  <h3 style="margin:0 0 12px;font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:.5px;">Productos</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="border-bottom:2px solid #e5e7eb;">
        <th style="text-align:left;padding:8px 0;font-size:12px;color:#9ca3af;">Producto</th>
        <th style="text-align:center;padding:8px 0;font-size:12px;color:#9ca3af;">Cant.</th>
        <th style="text-align:right;padding:8px 0;font-size:12px;color:#9ca3af;">Subtotal</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <!-- Links -->
  <a href="${orderUrl}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;margin-right:12px;">Ver orden →</a>
  <a href="https://supabase.com/dashboard" style="font-size:13px;color:#7c3aed;">Ver en Supabase →</a>
</body>
</html>`;

  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: customer.email,
      subject: `Confirmación de pedido #${shortId}`,
      html: customerHtml,
    }),
    resend.emails.send({
      from,
      to: ADMIN_EMAIL,
      subject: `Nueva venta - Orden #${shortId} - ${clp(total)}`,
      html: adminHtml,
    }),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[emails] Send failed:", result.reason);
    }
  }
}
