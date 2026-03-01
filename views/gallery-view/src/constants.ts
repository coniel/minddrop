import { GalleryGap, GalleryViewOptions } from './types';

export const defaultGalleryViewOptions: GalleryViewOptions = {
  maxColumns: 5,
  minColumnWidth: 300,
  gap: 'comfortable',
};

// Maps gap option values to CSS spacing tokens
export const GAP_SIZE: Record<GalleryGap, string> = {
  compact: 'var(--space-2)',
  comfortable: 'var(--space-4)',
  spacious: 'var(--space-6)',
};
