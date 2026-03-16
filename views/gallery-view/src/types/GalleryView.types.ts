import { View } from '@minddrop/views';

export type GalleryGap = 'none' | 'compact' | 'comfortable' | 'spacious';

export interface GalleryView extends View {
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
   * The ID of the card design used to render entries.
   * When not set, the database's default card design is used.
   */
  cardDesignId?: string;
}
