import { stringifyFragmentToMarkdown } from '../../stringifyFragmentToMarkdown';
import { Element } from '../../types';
import {
  TableColumnAlignment,
  TableElement,
  TableRowElement,
} from './TableElement.types';

/**
 * Stringifies a table element into a GFM table.
 *
 * @param element - The table element to stringify.
 * @returns A markdown table string.
 */
export const stringifyTableElementToMarkdown = (
  element: TableElement,
): string => {
  const rows = element.children as TableRowElement[];
  const [header, ...body] = rows;

  // A table without a header row has no valid GFM representation
  if (!header) {
    return '';
  }

  const columnCount = header.children.length;
  const lines = [
    stringifyRow(header),
    stringifyDelimiterRow(element.align, columnCount),
    ...body.map(stringifyRow),
  ];

  return lines.join('\n');
};

/**
 * Stringifies a single table row, escaping any pipe a cell contains.
 *
 * @param row - The table row element.
 * @returns The row's markdown line.
 */
function stringifyRow(row: TableRowElement): string {
  const cells = (row.children as Element[]).map((cell) =>
    stringifyFragmentToMarkdown(cell.children).replaceAll('|', '\\|'),
  );

  return `| ${cells.join(' | ')} |`;
}

/**
 * Builds the delimiter row which separates the header from the body and
 * declares each column's alignment.
 *
 * @param align - The alignment of each column.
 * @param columnCount - The number of columns the header declares.
 * @returns The delimiter row's markdown line.
 */
function stringifyDelimiterRow(
  align: TableColumnAlignment[],
  columnCount: number,
): string {
  const delimiters = Array.from({ length: columnCount }, (_unused, index) =>
    stringifyDelimiter(align[index]),
  );

  return `| ${delimiters.join(' | ')} |`;
}

/**
 * Returns the delimiter spelling for a column's alignment.
 *
 * @param alignment - The column's alignment.
 * @returns The delimiter.
 */
function stringifyDelimiter(alignment: TableColumnAlignment): string {
  if (alignment === 'left') {
    return ':---';
  }

  if (alignment === 'right') {
    return '---:';
  }

  if (alignment === 'center') {
    return ':---:';
  }

  return '---';
}
