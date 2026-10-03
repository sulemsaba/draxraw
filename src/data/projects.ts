import type { Project, ProjectLayoutVariant, ProjectStill } from '../types/project';

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
 * Real, collected film data — the source of truth for titles, types,
 * roles, years, links and thumbnails. Nothing here is invented.
 *
 * Stills are only attached when the photograph genuinely belongs to
 * the same project. The briefs are real collected copy from Drax's
 * live site; if any one of them ever turns out to be unverified, the
 * WorkDetail route omits Beat 4 entirely when `brief` is unset.
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
  displayTitle?: string;
  /** Real stills from the same project, optional. */
  stills?: ProjectStill[];
  /** Real project brief, optional. */
  brief?: string;
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
    youtubeId: film.youtubeId,
    role: film.role,
    description: film.description,
    vertical: film.youtubeUrl.includes('/shorts/'),
    layoutVariant: spec.layoutVariant,
    aspectRatio: spec.aspectRatio,
    stills: spec.stills,
    brief: spec.brief
  };
};

export const FILM_PROJECTS: Project[] = [
  /* 01 — strong film footage (cinematic showreel, the dar-girls portrait series) */
  toProject('world-that-never-stops', {
    number: '01',
    layoutVariant: 'spotlight',
    aspectRatio: '4 / 3',
    brief: byId.get('world-that-never-stops')!.description,
    stills: [
      { src: '/images/dar-girls-00162.jpg', alt: 'Subject framed against warm interior light, from the World That Never Stops series' },
      { src: '/images/dar-girls-00237.jpg', alt: 'Group portrait, World That Never Stops', width: 'narrow', align: 'right' },
      { src: '/images/dar-girls-00372.jpg', alt: 'Quiet moment captured between takes, World That Never Stops' },
      { src: '/images/dar-girls-00426.jpg', alt: 'Editorial portrait in daylight, World That Never Stops', width: 'wide' }
    ]
  }),
  /* 02 — book launch event film. Stills not yet verified for this project. */
  toProject('book-launch-highlights', {
    number: '02',
    layoutVariant: 'poster',
    aspectRatio: '2 / 3',
    brief: byId.get('book-launch-highlights')!.description
  }),
  /* 03 — documentary / school library photographs (read-tz-mugabe series) */
  toProject('library-social-impact', {
    number: '03',
    layoutVariant: 'cinema',
    aspectRatio: '3 / 2',
    displayTitle: 'A Place Transformed',
    brief: byId.get('library-social-impact')!.description,
    stills: [
      { src: '/images/read-tz-mugabe-07267.jpg', alt: 'Library interior with readers, from A Place Transformed' },
      { src: '/images/read-tz-mugabe-07296.jpg', alt: 'Student reader at the transformed library desk', width: 'narrow', align: 'right' }
    ]
  }),
  /* 04 — short documentary, same library project. Stills to be verified. */
  toProject('school-library-transformation', {
    number: '04',
    layoutVariant: 'spread',
    aspectRatio: '4 / 3',
    brief: byId.get('school-library-transformation')!.description
  }),
  /* 05 — engagement / celebration film (book-launch-02 series) */
  toProject('engagement-film', {
    number: '05',
    layoutVariant: 'frame',
    aspectRatio: '2 / 3',
    brief: byId.get('engagement-film')!.description,
    stills: [
      { src: '/images/book-launch-01.jpg', alt: 'Celebration frame, Engagement film', width: 'wide' }
    ]
  }),
  /* 06 — short form content (Shorts). Stills to be verified. */
  toProject('driven-by-purpose', {
    number: '06',
    layoutVariant: 'vertical',
    aspectRatio: '9 / 16',
    brief: byId.get('driven-by-purpose')!.description
  })
];

export const findProjectById = (id: string): Project | undefined =>
  FILM_PROJECTS.find((p) => p.id === id);
