import { ContentView } from '@minddrop/content-views';

export type GalleryGap = 'none' | 'compact' | 'comfortable' | 'spacious';

export interface GalleryView extends ContentView {
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
   * The ID of the card design each database's entries render
   * with, keyed by database ID. Databases without an override
   * use their default card design.
   */
  cardDesignOverrides?: Record<string, string>;
}
