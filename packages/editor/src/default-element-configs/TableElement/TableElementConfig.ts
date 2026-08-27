import {
  Ast,
  TableCellElement,
  TableElement,
  TableRowElement,
} from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { TableCellElementComponent } from './TableCellElementComponent';
import { TableElementComponent } from './TableElementComponent';
import { TableRowElementComponent } from './TableRowElementComponent';

export const TableElementConfig: EditorBlockElementConfig<TableElement> = {
  type: 'table',
  component: TableElementComponent,
  // The conversion declares only the column count: normalization builds the
  // grid around the block's content, since a conversion cannot replace its
  // children
  convert: () =>
    Ast.generateElement<TableElement>('table', { align: [null, null] }),
  shortcuts: ['| '],
  menuItems: [
    {
      label: 'editor.elements.table.name',
      keywords: 'editor.elements.table.keywords',
      icon: 'table',
      // Menu tables start wider than the shortcut's two columns
      data: { align: [null, null, null] },
    },
  ],
};

/**
 * Rows and cells are internal structure of the table block, so they carry
 * no conversions, shortcuts or menu entries of their own.
 */
export const TableRowElementConfig: EditorBlockElementConfig<TableRowElement> =
  {
    type: 'table-row',
    component: TableRowElementComponent,
  };

export const TableCellElementConfig: EditorBlockElementConfig<TableCellElement> =
  {
    type: 'table-cell',
    component: TableCellElementComponent,
  };
