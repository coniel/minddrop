import { View } from '@minddrop/views';

export interface TableView extends View {
  type: 'table';
  options: Partial<TableViewOptions>;
}

export type TablePadding = 'compact' | 'comfortable' | 'spacious';

export type FieldSize = 'sm' | 'md' | 'lg';

export interface TableViewOptions {
  overflow: boolean;
  showRowNumbers: boolean;
  /** Column IDs hidden from the table display. */
  hiddenColumns: string[];
  /**
   * Ordered list of column IDs defining the display order.
   * Columns not in this list appear after ordered ones,
   * in their default database property order.
   */
  columnOrder: string[];
  /** Percentage-based column widths used in non-overflow mode. */
  columnWidths: Record<string, number>;
  /** Pixel-based column widths used in overflow mode. */
  columnWidthsPx: Record<string, number>;
  padding: TablePadding;
  rowSeparator: boolean;
  columnSeparator: boolean;
  highlightOnHover: boolean;
  zebraStripes: boolean;
}

export interface TableColumnOption {
  label: string;
  value: string;
}

export interface TableColumn {
  id: string;
  name: string;
  type: string;
  options?: TableColumnOption[];
}

export interface TableRowData {
  id: string;
  cells: Record<string, string>;
}
