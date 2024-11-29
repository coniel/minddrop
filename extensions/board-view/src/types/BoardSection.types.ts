export interface BoardColumn {
  /**
   * This ID should be unique within the section.
   */
  id: string;

  /**
   * IDs of the blocks contained in the column.
   */
  blocks: string[];

  /**
   * Column title.
   */
  title?: string;
}

export interface BoardColumnsSection {
  type: 'columns';

  /**
   * This ID should be unique within the board.
   */
  id: string;

  /**
   * Columns in the board.
   */
  columns: BoardColumn[];
}

export interface BoardGridSection {
  type: 'grid';

  /**
   * This ID should be unique within the board.
   */
  id: string;

  /**
   * The IDs of blocks in the grid.
   */
  blocks: string[];
}

export interface BoardListSection {
  type: 'list';

  /**
   * This ID should be unique within the board.
   */
  id: string;

  /**
   * The IDs of blocks in the list.
   */
  blocks: string[];
}

export type BoardSection =
  | BoardColumnsSection
  | BoardGridSection
  | BoardListSection;
