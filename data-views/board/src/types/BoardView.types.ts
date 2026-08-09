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

export interface BoardViewToolbarCardOptions {
  /**
   * Whether the card is hidden from the toolbar.
   */
  hidden?: boolean;

  /**
   * The ID of the entry template used when creating entries via
   * the card. Blank entries are created when omitted.
   */
  templateId?: string;
}

export interface BoardViewOptions {
  /**
   * The card layout used to render each database's entries,
   * keyed by database ID. Databases without an override use
   * their default card layout.
   */
  cardLayoutOverrides?: Record<string, string>;

  /**
   * The toolbar's database card configuration, keyed by database
   * ID. Databases without an entry use the default behaviour: a
   * visible card creating blank entries.
   */
  toolbarCards?: Record<string, BoardViewToolbarCardOptions>;
}

export interface BoardViewData {
  /**
   * The arrangement of entries into columns.
   * Each element is an array of entry IDs belonging
   * to that column.
   */
  columns: BoardColumns;
}
