import { DataView } from '@minddrop/views';

export type GalleryGap = 'none' | 'compact' | 'comfortable' | 'spacious';

export interface GalleryView extends DataView {
  type: 'wall-view';
  options: Partial<GalleryViewOptions>;
}

export interface GalleryViewOptions {
  /**
   * The minimum width of a card in pixels.
   * The number of columns is calculated based on how many
   * cards fit at this width within the available space.
   */
  minColumnWidth: number;

  /**
   * The gap between cards.
   */
  gap: GalleryGap;

  /**
   * The ID of the card layout used to render entries.
   * When not set, the database's default card layout is used.
   */
  cardLayoutId?: string;
}
