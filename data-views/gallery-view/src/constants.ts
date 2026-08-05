import { GalleryGap, GalleryViewOptions } from './types';

export const defaultGalleryViewOptions: GalleryViewOptions = {
  minColumnWidth: 300,
  gap: 'comfortable',
};

// Maps gap option values to CSS spacing tokens
export const GAP_SIZE: Record<GalleryGap, string> = {
  none: '0px',
  compact: 'var(--space-2)',
  comfortable: 'var(--space-4)',
  spacious: 'var(--space-6)',
};
