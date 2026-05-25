// Vercel Edge Middleware — injects correct OG meta tags for social bots on product pages.
// Normal users pass through untouched; only bot User-Agents get a minimal HTML response.

export const config = {
  matcher: ["/producto/:path*"],
};

const SOCIAL_BOT_RE =
  /facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|Applebot/i;

const BASE_URL = "https://vitrax.cl";
const FALLBACK_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "Level Up";

function escape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildHtml(opts: {
  title: string;
  description: string;
  image: string;
  url: string;
}): string {
  const { title, description, image, url } = opts;
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${escape(url)}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:image" content="${escape(image)}">
  <meta property="og:url" content="${escape(url)}">
  <meta property="og:type" content="product">
  <meta property="og:locale" content="es_CL">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${escape(description)}">
  <meta name="twitter:image" content="${escape(image)}">
</head>
<body></body>
</html>`;
}

export default async function middleware(req: Request): Promise<Response | void> {
  const ua = req.headers.get("user-agent") ?? "";

  if (!SOCIAL_BOT_RE.test(ua)) return; // pass-through for real users

  const url = new URL(req.url);
  const match = url.pathname.match(/^\/producto\/(.+)$/);
  if (!match) return;

  const productId = match[1];
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) return;

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?id=eq.${encodeURIComponent(productId)}&active=eq.true&select=name,description,img&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!res.ok) return;

    const rows = (await res.json()) as Array<{
      name: string;
      description: string | null;
      img: string;
    }>;

    const product = rows[0];
    if (!product) return;

    const title = `${product.name} | ${SITE_NAME}`;
    const description = product.description
      ? product.description.slice(0, 160)
      : `${product.name} — disponible en Chile. Despacho a todo el país en 24-72h.`;
    const image = product.img || FALLBACK_IMAGE;
    const pageUrl = `${BASE_URL}/producto/${productId}`;

    return new Response(buildHtml({ title, description, image, url: pageUrl }), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return; // on any error, let the SPA handle it normally
  }
}
