import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import seo from '../data/seo.json';

type Pages = Record<string, { title: string; description: string }>;

/** Keep the title, description and canonical right as you move between pages. */
export const useSeo = () => {
  const route = useLocation().pathname.replace(/(.)\/$/, '$1');
  useEffect(() => {
    const page = (seo.pages as Pages)[route] ?? (seo.pages as Pages)['/'];
    document.title = page.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', page.description);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      const root = canonical.href.replace(/(films|photos|about|book|wallpapers)\/?$/, '');
      canonical.href = route === '/' ? root : `${root}${route.slice(1)}/`;
    }
  }, [route]);
};
