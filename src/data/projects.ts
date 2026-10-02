import type { Project } from '../types/project';

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

export const FILM_PROJECTS: Project[] = [
  {
    id: 'world-that-never-stops',
    number: '001',
    title: 'A WORLD THAT NEVER STOPS',
    category: 'DOCUMENTARY / EDIT',
    year: '2025',
    duration: '03:42',
    thumbnail: '/images/dar-girls-00584.jpg',
    youtubeId: 'HxAhX2KDeos',
    youtubeUrl: 'https://youtu.be/HxAhX2KDeos',
    role: 'PRODUCER & VIDEO EDITOR',
    description: 'An intimate study of rhythmic labor, dawn tides, and quiet resilience along the Indian Ocean coastline of Dar es Salaam.',
    layoutVariant: 'left-aligned',
    aspectRatio: '16/9',
    filmMeta: {
      camera: 'ARRI Alexa Mini LF',
      aspect: '2.39:1 Anamorphic',
      location: 'Dar es Salaam, TZ'
    }
  },
  {
    id: 'a-new-chapter',
    number: '002',
    title: 'A NEW CHAPTER',
    category: 'EVENT FILM',
    year: '2025',
    duration: '02:18',
    thumbnail: '/images/book-launch-01.jpg',
    youtubeId: 'hyaAb77XwGI',
    youtubeUrl: 'https://youtu.be/hyaAb77XwGI',
    role: 'CINEMATOGRAPHER & COLORIST',
    description: 'A cinematic celebration of a new book release, capturing unscripted human warmth, shared voices, and illuminated nightscapes.',
    layoutVariant: 'wide-scene',
    aspectRatio: '21/9',
    filmMeta: {
      camera: 'Sony FX6 RAW',
      aspect: '2.35:1 Scope',
      location: 'Oysterbay, TZ'
    }
  },
  {
    id: 'a-place-transformed',
    number: '003',
    title: 'A PLACE TRANSFORMED',
    category: 'SOCIAL IMPACT FILM',
    year: '2025',
    duration: '04:05',
    thumbnail: '/images/read-tz-mugabe-07280.jpg',
    youtubeId: 'tK7P7bwisdo',
    youtubeUrl: 'https://youtu.be/tK7P7bwisdo',
    role: 'DIRECTOR & EDITOR',
    description: 'Documenting how the renewal of a local school library catalyzed curiosity, dignity, and a sanctuary of self-discovery for young students.',
    layoutVariant: 'split-editorial',
    aspectRatio: '4/3',
    filmMeta: {
      camera: 'RED Komodo 6K',
      aspect: '4:3 Academy Format',
      location: 'Mugabe Secondary, TZ'
    }
  }
];
