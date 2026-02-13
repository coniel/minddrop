import { View } from '@minddrop/views';

export interface WallView extends View {
  type: 'wall-view';
  options: WallViewOptions;
}

export interface WallViewOptions {
  /**
   * The maximum number of columns to display.
   */
  maxColumns: number;
}
