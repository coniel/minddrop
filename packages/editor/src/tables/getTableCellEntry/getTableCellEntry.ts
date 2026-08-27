import {
  Location,
  Path,
  Editor as SlateEditor,
  Element as SlateElement,
} from 'slate';
import { TableCellElement } from '@minddrop/ast';
import { Editor } from '../../types';
import {
  TableCellEntry,
  isTableCellElement,
  isTableElement,
  isTableRowElement,
} from '../table-elements';

interface Options {
  at?: Location;
}

/**
 * Gets the table cell around a location (default: selection), along with
 * its row and table.
 *
 * @param editor - An editor.
 * @param options - Search options.
 * @returns The cell, row and table entries, or `null` when the location is
 *   not inside a table cell.
 */
export function getTableCellEntry(
  editor: Editor,
  options: Options = {},
): TableCellEntry | null {
  const at = options.at ?? editor.selection;

  // Without a location there is nothing to search around
  if (!at) {
    return null;
  }

  // Find the cell the location sits inside
  const cell = SlateEditor.above<TableCellElement>(editor, {
    at,
    match: (node) => SlateElement.isElement(node) && isTableCellElement(node),
  });

  if (!cell) {
    return null;
  }

  // A cell sits inside a row inside a table, so it is always at least two
  // levels deep
  if (cell[1].length < 2) {
    return null;
  }

  const rowPath = Path.parent(cell[1]);
  const tablePath = Path.parent(rowPath);
  const [rowNode] = SlateEditor.node(editor, rowPath);
  const [tableNode] = SlateEditor.node(editor, tablePath);

  // The structure around the cell may not be a table while normalization is
  // still repairing it
  if (!isTableRowElement(rowNode) || !isTableElement(tableNode)) {
    return null;
  }

  return {
    table: [tableNode, tablePath],
    row: [rowNode, rowPath],
    cell,
  };
}
