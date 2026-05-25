export const config = { runtime: "edge" };

const BASE_URL = "https://vitrax.cl";

const STATIC_ROUTES = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/suplementos", changefreq: "daily", priority: "0.9" },
  { loc: "/wearables", changefreq: "daily", priority: "0.9" },
  { loc: "/wellness", changefreq: "daily", priority: "0.9" },
];

export default async function handler(): Promise<Response> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_KEY;

  let productRoutes: Array<{ loc: string; changefreq: string; priority: string }> = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/products?active=eq.true&select=id&order=id.asc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (res.ok) {
        const products = (await res.json()) as Array<{ id: string }>;
        productRoutes = products.map((p) => ({
          loc: `/producto/${p.id}`,
          changefreq: "weekly",
          priority: "0.8",
        }));
      }
    } catch {
      // If Supabase is unreachable, serve sitemap without product routes
    }
  }

  const allRoutes = [...STATIC_ROUTES, ...productRoutes];

  const urlEntries = allRoutes
    .map(
      (r) =>
        `  <url>\n    <loc>${BASE_URL}${r.loc}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
