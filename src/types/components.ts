export interface Project {
  id: number;
  title: string;
  date: string;
  preview: string;
}

export interface GalleryItem {
  id: number;
  author: string;
  image: string;
}

export interface ProjectCardProps {
  project: Project;
}

export interface GalleryItemProps {
  item: GalleryItem;
}

export interface ErrorBoundaryProps {
  children: unknown;
  fallback?: unknown;
}

export interface CustomCursorProps {
  className?: string;
}

export interface BackgroundReelProps {
  interval?: number;
}

export interface ParticleEffectProps {
  count?: number;
  speed?: number;
}
