export type ProjectLayoutVariant =
  | 'spotlight'
  | 'poster'
  | 'cinema'
  | 'spread'
  | 'frame'
  | 'vertical';

export interface ProjectStill {
  /** Image path under /public/images/. */
  src: string;
  /** Optional alt text — required for accessibility. */
  alt: string;
  /**
   * Optional art-directed alignment within the editorial layout.
   * If omitted, the layout chooses a sensible default per the
   * image's native ratio. Only set when the composition clearly
   * calls for it (per the no-mechanical-crop rule).
   */
  align?: 'left' | 'right' | 'center';
  /** Optional editorial width within the section. */
  width?: 'full' | 'wide' | 'medium' | 'narrow';
}

export interface Project {
  id: string;
  number: string;
  title: string;
  type: string;
  year: string;
  thumbnail: string;
  youtubeUrl: string;
  youtubeId: string;
  role: string;
  description: string;
  vertical: boolean;
  layoutVariant: ProjectLayoutVariant;
  aspectRatio: string;
  /**
   * Optional additional real stills from the same project. Each one
   * becomes a frame in Beat 5 of the project page. Only populate
   * with real, verified photographs — never pad this list.
   */
  stills?: ProjectStill[];
  /**
   * Optional project-specific copy in Drax's voice. Must be real,
   * collected text — never invented from the general bio. If
   * absent, Beat 4 of the project page is omitted entirely.
   */
  brief?: string;
}
