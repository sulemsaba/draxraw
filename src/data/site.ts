// Everything on the site that is a fact about Drax lives here.

export const WHATSAPP_NUMBER = '255666040825';
const WHATSAPP_TEXT = "Hi Drax, I saw your work on draxraw. I'd like to book you for a shoot.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

export const YOUTUBE_URL = 'https://www.youtube.com/@DraxRaw';
export const INSTAGRAM_URL = 'https://www.instagram.com/drax.raw/';
export const INSTAGRAM_HANDLE = '@drax.raw';
export const EMAIL = 'draxraw0@gmail.com';

export type StickerColor = 'red' | 'yellow' | 'blue' | 'purple' | 'paper';

export interface Film {
  id: string;
  title: string;
  /** Shown under the title; leave empty when the title already says it. */
  kind: string;
  length: string;
  vertical?: boolean;
  color: StickerColor;
}

// Titles and lengths as published on youtube.com/@DraxRaw
export const FILMS: Film[] = [
  { id: 'HxAhX2KDeos', title: 'A World That Never Stops', kind: 'Cinematic reel', length: '1:20', color: 'yellow' },
  { id: 'hyaAb77XwGI', title: 'Book Launch Highlights', kind: 'Event film', length: '2:23', color: 'red' },
  { id: 'tK7P7bwisdo', title: 'Social Impact Video', kind: '', length: '4:09', color: 'paper' },
  { id: 'QoEMUUKstAI', title: 'Social Impact: Short Documentary', kind: '', length: '2:37', color: 'red' },
  { id: '1LPbfrHc6-U', title: 'Engagement', kind: 'Impact film', length: '2:06', color: 'yellow' },
  { id: 'iw1qnfriJIc', title: 'Social Media Reel', kind: '', length: '0:45', vertical: true, color: 'paper' },
];

export const SERVICES: { label: string; color: StickerColor }[] = [
  { label: 'Events & launches', color: 'red' },
  { label: 'NGO & impact films', color: 'blue' },
  { label: 'Brand films & ads', color: 'paper' },
  { label: 'Music videos', color: 'paper' },
  { label: 'Reels & shorts', color: 'yellow' },
  { label: 'Photography', color: 'red' },
];

export interface Print {
  src: string;
  alt: string;
}

export const PRINTS: Print[] = [
  { src: 'img/stills/dar-girls-00417.webp', alt: 'Two students walking down a dirt path between trees' },
  { src: 'img/stills/read-tz-mugabe-07280.webp', alt: 'A boy reading a book in a school library' },
  { src: 'img/stills/dar-girls-00162.webp', alt: 'Close up of a hand writing with a red pen' },
  { src: 'img/stills/dar-girls-00426.webp', alt: 'Two students reading together on the grass' },
  { src: 'img/stills/dar-girls-00127.webp', alt: 'A student walking along a school corridor holding a book' },
  { src: 'img/stills/read-tz-mugabe-07296.webp', alt: 'A student holding open an illustrated book' },
  { src: 'img/stills/dar-girls-00584.webp', alt: 'Two students reading side by side on a low wall' },
  { src: 'img/stills/dar-girls-00372.webp', alt: 'Two students reading at their classroom desks' },
  { src: 'img/stills/read-tz-mugabe-07267.webp', alt: 'Students reading together in a school library' },
  { src: 'img/stills/dar-girls-00173.webp', alt: 'A student in a white hijab reading at her classroom desk' },
  { src: 'img/stills/dar-girls-00237.webp', alt: 'A hand resting on an open textbook and notes' },
];

export interface Wallpaper {
  slug: string;
  title: string;
}

// Designed wallpapers: public/wallpapers/<slug>-phone.jpg (1080x2340)
// and <slug>-desktop.jpg (2560x1440), previews in public/img/walls/.
export const WALLPAPERS: Wallpaper[] = [
  { slug: 'starring', title: 'Starring' },
  { slug: 'countdown', title: 'Countdown' },
  { slug: 'redroom', title: 'Red room' },
  { slug: 'slate', title: 'Slate' },
  { slug: 'mark', title: 'DX' },
  { slug: 'vinyl', title: 'Vinyl' },
];
