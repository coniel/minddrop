import { NodeEntry, Path, Node as SlateNode } from 'slate';
import {
  Ast,
  TableCellElement,
  TableElement,
  TableRowElement,
} from '@minddrop/ast';

export interface TableCellEntry {
  /**
   * The table the cell belongs to.
   */
  table: NodeEntry<TableElement>;

  /**
   * The row the cell belongs to.
   */
  row: NodeEntry<TableRowElement>;

  /**
   * The cell itself.
   */
  cell: NodeEntry<TableCellElement>;
}

/**
 * Checks whether a node is a table element.
 *
 * @param node - A node.
 * @returns Whether the node is a table element.
 */
export function isTableElement(node: SlateNode): node is TableElement {
  return 'type' in node && node.type === 'table';
}

/**
 * Checks whether a node is a table row element.
 *
 * @param node - A node.
 * @returns Whether the node is a table row element.
 */
export function isTableRowElement(node: SlateNode): node is TableRowElement {
  return 'type' in node && node.type === 'table-row';
}

/**
 * Checks whether a node is a table cell element.
 *
 * @param node - A node.
 * @returns Whether the node is a table cell element.
 */
export function isTableCellElement(node: SlateNode): node is TableCellElement {
  return 'type' in node && node.type === 'table-cell';
}

/**
 * Generates an empty table cell.
 *
 * @returns A table cell element.
 */
export function generateTableCell(): TableCellElement {
  return Ast.generateElement<TableCellElement>('table-cell');
}

/**
 * Generates a table row of empty cells.
 *
 * @param columns - The number of cells to generate.
 * @returns A table row element.
 */
export function generateTableRow(columns: number): TableRowElement {
  return Ast.generateElement<TableRowElement>('table-row', {
    children: Array.from({ length: columns }, generateTableCell),
  });
}

/**
 * Returns the index of a cell entry's row within its table.
 *
 * @param cellEntry - The cell entry.
 * @returns The row index.
 */
export function tableCellRowIndex(cellEntry: TableCellEntry): number {
  const rowPath = cellEntry.row[1];

  return rowPath[rowPath.length - 1];
}

/**
 * Returns the index of a cell entry's cell within its row.
 *
 * @param cellEntry - The cell entry.
 * @returns The column index.
 */
export function tableCellColumnIndex(cellEntry: TableCellEntry): number {
  const cellPath = cellEntry.cell[1];

  return cellPath[cellPath.length - 1];
}

/**
 * Returns the path of the cell after a cell, wrapping to the next row's
 * first cell.
 *
 * @param cellEntry - The cell entry.
 * @returns The next cell's path, or null in the table's last cell.
 */
export function resolveNextTableCellPath(
  cellEntry: TableCellEntry,
): Path | null {
  const [tableNode, tablePath] = cellEntry.table;
  const rowIndex = tableCellRowIndex(cellEntry);
  const columnIndex = tableCellColumnIndex(cellEntry);

  // Within a row the next cell is simply the one after
  if (columnIndex < cellEntry.row[0].children.length - 1) {
    return [...tablePath, rowIndex, columnIndex + 1];
  }

  // The table's last cell has no cell after it
  if (rowIndex === tableNode.children.length - 1) {
    return null;
  }

  // At the end of a row, wrap to the next row's first cell
  return [...tablePath, rowIndex + 1, 0];
}

/**
 * Returns the path of the cell before a cell, wrapping to the previous
 * row's last cell.
 *
 * @param cellEntry - The cell entry.
 * @returns The previous cell's path, or null in the table's first cell.
 */
export function resolvePreviousTableCellPath(
  cellEntry: TableCellEntry,
): Path | null {
  const [tableNode, tablePath] = cellEntry.table;
  const rowIndex = tableCellRowIndex(cellEntry);
  const columnIndex = tableCellColumnIndex(cellEntry);

  // Within a row the previous cell is simply the one before
  if (columnIndex > 0) {
    return [...tablePath, rowIndex, columnIndex - 1];
  }

  // The table's first cell has no cell before it
  if (rowIndex === 0) {
    return null;
  }

  // At the start of a row, wrap to the previous row's last cell
  const previousRow = tableNode.children[rowIndex - 1] as TableRowElement;

  return [...tablePath, rowIndex - 1, previousRow.children.length - 1];
}
