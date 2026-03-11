import { View } from '@minddrop/views';

/**
 * Represents the placement of entries across columns.
 * Each inner array holds the entry IDs for that column,
 * ordered top to bottom.
 */
export type BoardColumns = string[][];

export interface BoardView extends View {
  type: 'board';
  options: Partial<BoardViewOptions>;
}

export interface BoardViewOptions {
  /**
   * The arrangement of entries into columns.
   * Each element is an array of entry IDs belonging
   * to that column.
   */
  columns: BoardColumns;
}
