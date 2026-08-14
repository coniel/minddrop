import { Element } from '../../types';

export type TableColumnAlignment = 'left' | 'right' | 'center' | null;

export interface TableElementData {
  /**
   * The alignment of each column, as declared by the delimiter row.
   */
  align: TableColumnAlignment[];
}

export type TableElement = Element<'table', TableElementData>;

export type TableRowElement = Element<'table-row'>;

export type TableCellElement = Element<'table-cell'>;
