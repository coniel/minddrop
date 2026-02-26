import { SelectOption } from '@minddrop/ui-primitives';
import { FieldSize, TablePadding, TableViewOptions } from './types';

export const defaultTableViewOptions: TableViewOptions = {
  showRowNumbers: true,
  columnWidths: {},
  padding: 'comfortable',
  rowSeparator: true,
  columnSeparator: false,
  highlightOnHover: true,
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
