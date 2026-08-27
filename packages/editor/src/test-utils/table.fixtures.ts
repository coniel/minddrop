import {
  Ast,
  TableCellElement,
  TableColumnAlignment,
  TableElement,
  TableRowElement,
} from '@minddrop/ast';

/**
 * Generates a table cell containing the given text.
 *
 * @param text - The cell's text.
 * @returns A table cell element.
 */
export function generateTestTableCell(text = ''): TableCellElement {
  return Ast.generateElement<TableCellElement>('table-cell', {
    children: [{ text }],
  });
}

/**
 * Generates a table row of cells containing the given texts.
 *
 * @param texts - The cells' texts.
 * @returns A table row element.
 */
export function generateTestTableRow(texts: string[]): TableRowElement {
  return Ast.generateElement<TableRowElement>('table-row', {
    children: texts.map(generateTestTableCell),
  });
}

/**
 * Generates a table of rows containing the given texts.
 *
 * @param rows - The rows' cell texts.
 * @param align - The table's alignment, defaulting to none per column.
 * @returns A table element.
 */
export function generateTestTable(
  rows: string[][],
  align?: TableColumnAlignment[],
): TableElement {
  return Ast.generateElement<TableElement>('table', {
    align: align ?? rows[0].map(() => null),
    children: rows.map(generateTestTableRow),
  });
}
