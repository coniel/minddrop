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
  columnWidths: Record<string, number>;
  padding: TablePadding;
  rowSeparator: boolean;
  columnSeparator: boolean;
  highlightOnHover: boolean;
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
