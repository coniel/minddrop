import { SelectOption } from '@minddrop/ui-primitives';
import { FieldSize, TablePadding, TableViewOptions } from './types';

export const DEFAULT_COLUMN_WIDTH = 200;
export const DEFAULT_TITLE_COLUMN_WIDTH = 300;
export const MIN_COLUMN_WIDTH_PX = 100;
export const MIN_COLUMN_WIDTH_PCT = 10;

export const defaultTableViewOptions: TableViewOptions = {
  overflow: false,
  showRowNumbers: true,
  columnWidths: {},
  columnWidthsPx: {},
  padding: 'comfortable',
  rowSeparator: true,
  columnSeparator: false,
  highlightOnHover: true,
  zebraStripes: false,
};

export const FIELD_SIZE: Record<TablePadding, FieldSize> = {
  compact: 'sm',
  comfortable: 'md',
  spacious: 'lg',
};

export const ROW_HEIGHT: Record<TablePadding, string> = {
  compact: '1.75rem',
  comfortable: '2.5rem',
  spacious: '3.25rem',
};

export const ROW_HEIGHT_PX: Record<TablePadding, number> = {
  compact: 28,
  comfortable: 40,
  spacious: 52,
};

export const PAGE_SIZE_OPTIONS: SelectOption<number>[] = [
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: '500', value: 500 },
];
