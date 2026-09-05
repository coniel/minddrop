import { DataView } from '@minddrop/data-views';
import { ContentColor } from '@minddrop/ui-theme';

/**
 * The width the columns take: sharing the board's width between
 * them, or one of the fixed presets, which overflow the board.
 */
export type KanbanColumnWidth = 'fill' | 'narrow' | 'regular' | 'wide';

/**
 * The surface the columns are drawn on: none, a neutral step up
 * from the view's background, or a tint of the option's colour.
 */
export type KanbanColumnBackground = 'none' | 'neutral' | 'accent';

export interface KanbanColumn {
  /**
   * The select option value the column groups entries by, empty
   * for the no-value column.
   */
  value: string;

  /**
   * The column's heading. Option columns are labelled with their
   * option value, the no-value column with a localised label.
   */
  label: string;

  /**
   * The option's colour, absent on the no-value column.
   */
  color?: ContentColor;

  /**
   * The IDs of the entries in the column, ordered top to bottom.
   */
  entryIds: string[];
}

/**
 * The placement of entries within their columns, keyed by the
 * column's option value. The no-value column is keyed by an
 * empty string.
 */
export type KanbanOrder = Record<string, string[]>;

export interface KanbanView extends DataView {
  type: 'kanban';
  options: Partial<KanbanViewOptions>;
  data: Partial<KanbanViewData>;
}

export interface KanbanViewOptions {
  /**
   * The name of the select property the columns are generated
   * from. The first available select property is used when
   * omitted.
   */
  groupBy?: string;

  /**
   * The option values of the columns hidden from the board. The
   * no-value column is keyed by an empty string.
   */
  hiddenOptions?: string[];

  /**
   * Whether columns holding no entries are hidden from the board.
   */
  hideEmptyColumns?: boolean;

  /**
   * The width the columns take.
   */
  columnWidth?: KanbanColumnWidth;

  /**
   * The background the columns are drawn on.
   */
  columnBackground?: KanbanColumnBackground;

  /**
   * Whether each column's cards scroll on their own. The board
   * scrolls as a whole when off.
   */
  columnScroll?: boolean;

  /**
   * The card layout used to render each database's entries,
   * keyed by database ID. Databases without an override use
   * their default card layout.
   */
  cardLayoutOverrides?: Record<string, string>;
}

export interface KanbanViewData {
  /**
   * The placement of entries within their columns. Column
   * membership is derived from the entries' property values, so
   * this records position only.
   */
  order: KanbanOrder;
}
