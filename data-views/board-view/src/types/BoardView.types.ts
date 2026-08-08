import { DataView } from '@minddrop/data-views';

/**
 * Represents the placement of entries across columns.
 * Each inner array holds the entry IDs for that column,
 * ordered top to bottom.
 */
export type BoardColumns = string[][];

export interface BoardView extends DataView {
  type: 'board';
  options: Partial<BoardViewOptions>;
  data: Partial<BoardViewData>;
}

export interface BoardViewOptions {
  /**
   * The card layout used to render each database's entries,
   * keyed by database ID. Databases without an override use
   * their default card layout.
   */
  cardLayoutOverrides?: Record<string, string>;
}

export interface BoardViewData {
  /**
   * The arrangement of entries into columns.
   * Each element is an array of entry IDs belonging
   * to that column.
   */
  columns: BoardColumns;
}
