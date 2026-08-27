import { stringifyFragmentToPlainText } from '../../stringifyFragmentToPlainText';
import { Element } from '../../types';
import { TableElement, TableRowElement } from './TableElement.types';

/**
 * Stringifies a table element into plain text, cells separated by tabs and
 * rows by newlines.
 *
 * @param element - The table element to stringify.
 * @returns The table's plain text content.
 */
export const stringifyTableElementToPlainText = (
  element: TableElement,
): string => {
  // Each row becomes a line of tab separated cell content
  return (element.children as TableRowElement[])
    .map((row) =>
      (row.children as Element[])
        .map((cell) => stringifyFragmentToPlainText(cell.children))
        .join('\t'),
    )
    .join('\n');
};
