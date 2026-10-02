import type { Project, ProjectLayoutVariant } from '../types/project';

export interface DraxFilmEntry {
  id: string;
  youtubeId: string;
  youtubeUrl: string;
  title: string;
  type: string;
  category: string;
  role: string;
  year: string;
  description: string;
  thumbnail: string;
}

export const DRAX_YOUTUBE_CHANNEL = {
  name: 'Drax Raw',
  handle: '@DraxRaw',
  url: 'http://www.youtube.com/@DraxRaw'
};

/**
 * Real, collected film data (source of truth for titles, types,
 * roles, years, links and thumbnails). The homepage projects below
 * are derived from these entries — nothing is invented here.
 */
export const ALL_COLLECTED_FILMS: DraxFilmEntry[] = [
  {
    id: 'world-that-never-stops',
    youtubeId: 'HxAhX2KDeos',
    youtubeUrl: 'https://youtu.be/HxAhX2KDeos',
    title: 'A World That Never Stops',
    type: 'Cinematic Showreel',
    category: 'DOCUMENTARY / EDIT',
    role: 'Producer & Video Editor',
    year: '2026',
    description: 'A cinematic exploration of nature, movement and the connection between people and the world around them.',
    thumbnail: '/images/dar-girls-00584.jpg'
  },
  {
    id: 'book-launch-highlights',
    youtubeId: 'hyaAb77XwGI',
    youtubeUrl: 'https://youtu.be/hyaAb77XwGI',
    title: 'Book Launch | Highlights',
    type: 'Event Highlight Film',
    category: 'EVENT FILM',
    role: 'Cinematographer & Colorist',
    year: '2026',
    description: 'A cinematic highlight film that captures a celebration of a new book, bringing together stories, people, and unforgettable moments.',
    thumbnail: '/images/book-launch-01.jpg'
  },
  {
    id: 'library-social-impact',
    youtubeId: 'tK7P7bwisdo',
    youtubeUrl: 'https://youtu.be/tK7P7bwisdo',
    title: 'A Place Transformed (Social Impact)',
    type: 'Social Impact Film',
    category: 'SOCIAL IMPACT FILM',
    role: 'Director & Editor',
    year: '2026',
    description: 'A film documenting how one library became a space for learning, opportunity, and positive community change.',
    thumbnail: '/images/read-tz-mugabe-07280.jpg'
  },
  {
    id: 'school-library-transformation',
    youtubeId: 'QoEMUUKstAI',
    youtubeUrl: 'https://youtu.be/QoEMUUKstAI',
    title: 'Social Impact | Short Documentary',
    type: 'Short Documentary',
    category: 'DOCUMENTARY',
    role: 'Director & Editor',
    year: '2026',
    description: 'This film reveals the difference that support made in transforming their school library and learning environment.',
    thumbnail: '/images/read-tz-mugabe-07296.jpg'
  },
  {
    id: 'engagement-film',
    youtubeId: '1LPbfrHc6-U',
    youtubeUrl: 'https://youtu.be/1LPbfrHc6-U',
    title: 'Engagement',
    type: 'Event / Celebration Film',
    category: 'EVENT FILM',
    role: 'Cinematographer & Lead Editor',
    year: '2026',
    description: 'An emotional cinematic celebration capturing intimate family bonds and the beginning of a shared lifetime.',
    thumbnail: '/images/book-launch-02.jpg'
  },
  {
    id: 'driven-by-purpose',
    youtubeId: 'iw1qnfriJIc',
    youtubeUrl: 'https://youtube.com/shorts/iw1qnfriJIc?feature=share',
    title: 'Driven by Purpose',
    type: 'Social Media Reel (Shorts)',
    category: 'SHORT FORM CONTENT',
    role: 'Video Editor',
    year: '2026',
    description: 'A fast-paced short-form video highlighting the work, purpose, and mission behind the institution.',
    thumbnail: '/images/dar-girls-00127.jpg'
  }
];

const byId = new Map(ALL_COLLECTED_FILMS.map((film) => [film.id, film]));

interface PresentationSpec {
  number: string;
  layoutVariant: ProjectLayoutVariant;
  aspectRatio: string;
  /** Optional display-title trim, always a substring of the real title. */
  displayTitle?: string;
}

const toProject = (id: string, spec: PresentationSpec): Project => {
  const film = byId.get(id);
  if (!film) {
    throw new Error(`Unknown film id: ${id}`);
  }
  return {
    id: film.id,
    number: spec.number,
    title: spec.displayTitle ?? film.title,
    type: film.type,
    year: film.year,
    thumbnail: film.thumbnail,
    youtubeUrl: film.youtubeUrl,
    layoutVariant: spec.layoutVariant,
    aspectRatio: spec.aspectRatio
  };
};

/**
 * The three homepage features. Rhythm:
 * 01 — landscape feature on dark (the featured film)
 * 02 — portrait offset on light (editorial counterpoint)
 * 03 — near full-bleed on dark (closing transition)
 */
export const FILM_PROJECTS: Project[] = [
  toProject('world-that-never-stops', {
    number: '01',
    layoutVariant: 'landscape-feature',
    aspectRatio: '4 / 3'
  }),
  toProject('book-launch-highlights', {
    number: '02',
    layoutVariant: 'portrait-offset',
    aspectRatio: '2 / 3'
  }),
  toProject('library-social-impact', {
    number: '03',
    layoutVariant: 'full-bleed',
    aspectRatio: '3 / 2',
    displayTitle: 'A Place Transformed'
  })
];
