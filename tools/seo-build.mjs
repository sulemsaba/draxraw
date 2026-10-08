// After `vite build`: one real HTML file per page with its own title,
// description, canonical and preview tags, structured data (JSON-LD),
// sitemap.xml and robots.txt. The site address comes from SITE_URL.
import fs from 'node:fs';
import path from 'node:path';

const seo = JSON.parse(fs.readFileSync('src/data/seo.json', 'utf8'));
const SITE = (process.env.SITE_URL || seo.defaultUrl).replace(/\/?$/, '/');
const dist = 'dist';
const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const iso = (s) => `PT${Math.floor(s / 60)}M${s % 60}S`;
const urlFor = (route) => (route === '/' ? SITE : `${SITE}${route.slice(1)}/`);

const person = {
  '@type': 'Person',
  '@id': `${SITE}#drax`,
  name: 'Drax',
  alternateName: seo.name,
  jobTitle: seo.person.jobTitle,
  url: SITE,
  image: `${SITE}img/drax-shades.webp`,
  email: `mailto:${seo.person.email}`,
  telephone: seo.person.telephone,
  sameAs: seo.person.sameAs,
  address: { '@type': 'PostalAddress', addressLocality: seo.person.city, addressCountry: seo.person.country },
};

const business = {
  '@type': 'ProfessionalService',
  '@id': `${SITE}#business`,
  name: seo.name,
  description: seo.pages['/'].description,
  url: SITE,
  image: `${SITE}og.jpg`,
  logo: `${SITE}img/logo.webp`,
  email: seo.person.email,
  telephone: seo.person.telephone,
  priceRange: '$$',
  address: { '@type': 'PostalAddress', addressLocality: seo.person.city, addressCountry: seo.person.country },
  areaServed: [{ '@type': 'City', name: 'Dar es Salaam' }, { '@type': 'Country', name: 'Tanzania' }],
  founder: { '@id': `${SITE}#drax` },
  sameAs: seo.person.sameAs,
  knowsAbout: seo.person.services,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'bookings',
    telephone: seo.person.telephone,
    email: seo.person.email,
    url: `https://wa.me/${seo.person.telephone.replace('+', '')}`,
  },
};

const videos = seo.films.map((f) => ({
  '@type': 'VideoObject',
  name: f.title,
  description: f.description,
  thumbnailUrl: [`https://i.ytimg.com/vi/${f.id}/maxresdefault.jpg`],
  uploadDate: `${f.date}T09:00:00+00:00`,
  duration: iso(f.seconds),
  embedUrl: `https://www.youtube.com/embed/${f.id}`,
  contentUrl: `https://www.youtube.com/watch?v=${f.id}`,
  creator: { '@id': `${SITE}#drax` },
}));

const graphFor = (route) => {
  const page = { '@type': 'WebPage', '@id': urlFor(route), url: urlFor(route), name: seo.pages[route].title, description: seo.pages[route].description, isPartOf: { '@id': `${SITE}#site` }, about: { '@id': `${SITE}#drax` } };
  const site = { '@type': 'WebSite', '@id': `${SITE}#site`, url: SITE, name: seo.name, inLanguage: 'en' };
  const graph = [site, page, person, business];
  if (route === '/films' || route === '/') graph.push(...videos);
  return { '@context': 'https://schema.org', '@graph': graph };
};

const render = (route) => {
  const { title, description } = seo.pages[route];
  const url = urlFor(route);
  let html = base
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/https:\/\/sulemsaba\.github\.io\/draxraw\/og\.jpg/g, `${SITE}og.jpg`);
  const extra = [
    `<link rel="canonical" href="${url}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta name="author" content="Drax Raw" />`,
    `<meta name="geo.region" content="TZ-02" />`,
    `<meta name="geo.placename" content="Dar es Salaam" />`,
    `<script type="application/ld+json">${JSON.stringify(graphFor(route))}</script>`,
  ].join('\n    ');
  html = html.replace('</head>', `    ${extra}\n  </head>`);
  // Plain links and text for crawlers that do not run JavaScript
  const nav = Object.keys(seo.pages)
    .map((r) => `<a href="${urlFor(r)}">${r === '/' ? 'Home' : r.slice(1).replace(/^./, (c) => c.toUpperCase())}</a>`)
    .join(' ');
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <noscript><h1>${esc(title)}</h1><p>${esc(description)}</p><nav>${nav}</nav></noscript>`
  );
  return html;
};

for (const route of Object.keys(seo.pages)) {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, render(route));
}
// Unknown paths load the app (it sends them home)
fs.writeFileSync(path.join(dist, '404.html'), render('/').replace('index, follow', 'noindex'));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${Object.keys(seo.pages)
  .map((r) => `  <url><loc>${urlFor(r)}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : '0.8'}</priority>${r === '/' ? `<image:image><image:loc>${SITE}og.jpg</image:loc></image:image>` : ''}</url>`)
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
console.log(`SEO: ${Object.keys(seo.pages).length} pages, sitemap and robots for ${SITE}`);
