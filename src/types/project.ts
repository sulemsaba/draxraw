export type ProjectLayoutVariant = 'landscape-feature' | 'portrait-offset' | 'full-bleed';

/**
 * Homepage project presentation.
 * Only provable, supplied content lives here — no camera specs,
 * no durations, no invented copy. Deeper real data (roles,
 * descriptions, YouTube ids) stays in `data/projects.ts`
 * (`ALL_COLLECTED_FILMS`) for the future project pages.
 */
export interface Project {
  id: string;
  number: string;
  title: string;
  type: string;
  year: string;
  thumbnail: string;
  youtubeUrl: string;
  layoutVariant: ProjectLayoutVariant;
  aspectRatio: string;
}
