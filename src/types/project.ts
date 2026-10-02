export type ProjectLayoutVariant = 'left-aligned' | 'wide-scene' | 'split-editorial';

export interface Project {
  id: string;
  number: string; // e.g. "001"
  title: string;
  category: string;
  year: string;
  duration?: string;
  thumbnail: string;
  youtubeId?: string;
  youtubeUrl?: string;
  role: string;
  description: string;
  layoutVariant: ProjectLayoutVariant;
  aspectRatio?: string;
  filmMeta?: {
    camera?: string;
    aspect?: string;
    location?: string;
  };
}
