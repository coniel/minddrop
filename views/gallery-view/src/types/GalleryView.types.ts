import { View } from '@minddrop/views';

export interface GalleryView extends View {
  type: 'wall-view';
  options: Partial<GalleryViewOptions>;
}

export interface GalleryViewOptions {
  /**
   * The maximum number of columns to display.
   */
  maxColumns: number;

  /**
   * The minimum width of a column.
   */
  minColumnWidth: number;
}
