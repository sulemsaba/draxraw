export type ProjectLayoutVariant = 'spotlight' | 'poster' | 'cinema' | 'spread' | 'frame' | 'vertical';

/**
 * Homepage project presentation.
 * Only provable, supplied content lives here — roles, descriptions
 * and YouTube ids come straight from `data/projects.ts`
 * (`ALL_COLLECTED_FILMS`). Nothing is invented.
 */
export interface Project {
  id: string;
  number: string;
  title: string;
  type: string;
  year: string;
  thumbnail: string;
  youtubeUrl: string;
  /** Plain video id — drives the muted in-page previews + cinema embeds. */
  youtubeId: string;
  role: string;
  description: string;
  /** Shorts are vertical — the cinema stage letterboxes them accordingly. */
  vertical: boolean;
  layoutVariant: ProjectLayoutVariant;
  aspectRatio: string;
}
