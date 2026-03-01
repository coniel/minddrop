import { ContentColor } from '@minddrop/ui-primitives';
import { View } from '@minddrop/views';

export interface TableView extends View {
  type: 'table';
  options: Partial<TableViewOptions>;
}

export type TablePadding = 'compact' | 'comfortable' | 'spacious';

export type FieldSize = 'sm' | 'md' | 'lg';

export interface ColumnConfig {
  /**
   * Percentage-based width used in non-overflow mode.
   */
  width?: number;

  /**
   * Pixel-based width used in overflow mode.
   */
  widthPx?: number;

  /**
   * Whether the column is hidden.
   */
  hidden?: boolean;

  /**
   * Whether to display select values as colored chips.
   * Defaults to true when undefined.
   */
  showChips?: boolean;
}

export interface TableViewOptions {
  overflow: boolean;
  showRowNumbers: boolean;
  /**
   * Ordered list of column IDs defining the display order.
   * Columns not in this list appear after ordered ones,
   * in their default database property order.
   */
  columnOrder: string[];
  /**
   * Per-column configuration (widths, visibility, etc.).
   */
  columns: Record<string, ColumnConfig>;
  padding: TablePadding;
  rowSeparator: boolean;
  columnSeparator: boolean;
  highlightOnHover: boolean;
  zebraStripes: boolean;
}

export interface TableSelectOption {
  label: string;
  value: string;
  color?: ContentColor;
}

export interface TableColumn {
  id: string;
  name: string;
  type: string;
  options?: TableSelectOption[];

  /**
   * Whether to display select values as colored chips.
   * Defaults to true when undefined.
   */
  showChips?: boolean;
}

export interface TableRowData {
  id: string;
  cells: Record<string, string>;
}
