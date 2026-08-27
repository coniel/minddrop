import { stringifyFragmentToMarkdown } from '../../stringifyFragmentToMarkdown';
import { Element } from '../../types';
import {
  TableColumnAlignment,
  TableElement,
  TableRowElement,
} from './TableElement.types';

// The narrowest column, matching the conventional three character
// delimiter and leaving a centre alignment at least one dash
const MinimumColumnWidth = 3;

/**
 * Stringifies a table element into a GFM table, with every column padded
 * to its longest cell so the source reads as an aligned grid.
 *
 * @param element - The table element to stringify.
 * @returns A markdown table string.
 */
export const stringifyTableElementToMarkdown = (
  element: TableElement,
): string => {
  const rows = element.children as TableRowElement[];
  const [header] = rows;

  // A table without a header row has no valid GFM representation
  if (!header) {
    return '';
  }

  // Serialize every cell up front so the column widths can be measured
  const cellRows = rows.map((row) =>
    (row.children as Element[]).map((cell) =>
      stringifyFragmentToMarkdown(cell.children).replaceAll('|', '\\|'),
    ),
  );

  const widths = resolveColumnWidths(cellRows);

  const lines = [
    stringifyRow(cellRows[0], widths),
    stringifyDelimiterRow(element.align, header.children.length, widths),
    ...cellRows.slice(1).map((cells) => stringifyRow(cells, widths)),
  ];

  return lines.join('\n');
};

/**
 * Measures each column's width, being its longest cell across every row.
 *
 * @param cellRows - The serialized cell content of each row.
 * @returns The column widths.
 */
function resolveColumnWidths(cellRows: string[][]): number[] {
  const columns = Math.max(0, ...cellRows.map((cells) => cells.length));

  return Array.from({ length: columns }, (unused, column) =>
    Math.max(
      MinimumColumnWidth,
      ...cellRows.map((cells) => cells[column]?.length ?? 0),
    ),
  );
}

/**
 * Stringifies a single table row, padding each cell to its column's width.
 *
 * @param cells - The row's serialized cell content.
 * @param widths - The column widths.
 * @returns The row's markdown line.
 */
function stringifyRow(cells: string[], widths: number[]): string {
  const padded = cells.map((cell, column) => cell.padEnd(widths[column]));

  return `| ${padded.join(' | ')} |`;
}

/**
 * Builds the delimiter row which separates the header from the body and
 * declares each column's alignment, sized to the column widths.
 *
 * @param align - The alignment of each column.
 * @param columnCount - The number of columns the header declares.
 * @param widths - The column widths.
 * @returns The delimiter row's markdown line.
 */
function stringifyDelimiterRow(
  align: TableColumnAlignment[],
  columnCount: number,
  widths: number[],
): string {
  const delimiters = Array.from({ length: columnCount }, (unused, column) =>
    stringifyDelimiter(align[column], widths[column] ?? MinimumColumnWidth),
  );

  return `| ${delimiters.join(' | ')} |`;
}

/**
 * Returns the delimiter spelling for a column's alignment, filled with
 * dashes to the column's width.
 *
 * @param alignment - The column's alignment.
 * @param width - The column's width.
 * @returns The delimiter.
 */
function stringifyDelimiter(
  alignment: TableColumnAlignment,
  width: number,
): string {
  if (alignment === 'left') {
    return `:${'-'.repeat(width - 1)}`;
  }

  if (alignment === 'right') {
    return `${'-'.repeat(width - 1)}:`;
  }

  if (alignment === 'center') {
    return `:${'-'.repeat(width - 2)}:`;
  }

  return '-'.repeat(width);
}
