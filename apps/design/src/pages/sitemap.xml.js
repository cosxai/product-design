// The pages search engines should know: every indexed page at its clean URL.
import seo from '../seo.json';

export function GET() {
  const urls = Object.entries(seo)
    .filter(([, m]) => m.index)
    .map(([path]) => `  <url><loc>https://design.cosx.co${path}</loc></url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
