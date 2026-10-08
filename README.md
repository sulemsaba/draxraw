# Drax Raw

Portfolio site for Drax Raw, filmmaker, video editor and photographer in Dar es Salaam.
React + Vite + GSAP.

```bash
npm install
npm run dev      # local preview
npm run build    # production build into dist/ (also writes per-page SEO files, sitemap, robots)
```

## Hosting

The site is fully static: any static host works, no server needed.

**Cloudflare Pages (recommended)**: connect this GitHub repo, then

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `SITE_URL` = the final address, e.g. `https://draxraw.com/`

Add the custom domain under the project's Custom domains tab. A domain bought through
Cloudflare Registrar is sold at cost and needs no extra DNS setup.

**GitHub Pages** (current): `.github/workflows/pages.yml` builds with
`BASE_PATH=/draxraw/` on every push to `main`.

## SEO

Page titles, descriptions, contact details and the film list for structured data
live in `src/data/seo.json`. `tools/seo-build.mjs` turns them into one HTML file per
page, `sitemap.xml` and `robots.txt` after each build.

After going live: add the site to Google Search Console, submit `sitemap.xml`, and
link the site from Drax's Instagram and YouTube profiles.
