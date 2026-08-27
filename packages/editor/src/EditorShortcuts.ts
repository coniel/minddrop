import { openUrl } from '@minddrop/utils';
import { indentBlocks } from './indentBlocks';
import { outdentBlocks } from './outdentBlocks';
import { escapeEmptyTableCell } from './tables/escapeEmptyTableCell';
import { exitTableForward } from './tables/exitTableForward';
import { insertTableRowBelow } from './tables/insertTableRowBelow';
import { selectNextTableCell } from './tables/selectNextTableCell';
import { selectPreviousTableCell } from './tables/selectPreviousTableCell';
import { selectTableCellAbove } from './tables/selectTableCellAbove';
import { selectTableCellBelow } from './tables/selectTableCellBelow';
import { selectTableCellContent } from './tables/selectTableCellContent';
import { EditorShortcut } from './types';
import { getIndentTargetPaths, resolveLinkAtCursor } from './utils';

/**
 * The keystrokes the editor acts on, beyond those belonging to a menu or to
 * a mark.
 *
 * A shortcut is a keystroke and what it does, so adding one means adding an
 * entry here rather than another handler to the editor.
 */
export const EditorShortcuts: EditorShortcut[] = [
  {
    // Tab moves blocks between the containers around them, which is the only
    // thing it does in the editor: it never inserts a tab, and never moves
    // the focus out of the editor
    hotkey: 'tab',
    run: (editor) => {
      // Inside a table, Tab moves between cells, shadowing the indent
      // binding
      if (selectNextTableCell(editor)) {
        return true;
      }

      indentBlocks(editor, getIndentTargetPaths(editor));

      return true;
    },
  },
  {
    hotkey: 'shift+tab',
    run: (editor) => {
      // Inside a table, Shift-Tab moves between cells, shadowing the
      // outdent binding
      if (selectPreviousTableCell(editor)) {
        return true;
      }

      outdentBlocks(editor, getIndentTargetPaths(editor));

      return true;
    },
  },
  {
    // Handled as a keystroke because the soft break it would otherwise
    // produce is not delivered uniformly across webviews. Outside a table
    // the keystroke is declined and inserts a soft break as usual.
    hotkey: 'shift+enter',
    run: (editor) => insertTableRowBelow(editor),
  },
  {
    // Vertical arrows move between a table's rows cell by cell, keeping
    // the column. Outside a table they are declined, leaving the caret
    // movement native.
    hotkey: 'up',
    // Moving the selection does not change the document
    readOnly: true,
    run: (editor) => selectTableCellAbove(editor),
  },
  {
    hotkey: 'down',
    readOnly: true,
    run: (editor) => selectTableCellBelow(editor),
  },
  {
    // Select-all inside a table selects the cell first, expanding to the
    // whole document on a second press. Outside a table the keystroke is
    // declined, leaving the native select-all.
    hotkey: 'mod+a',
    // Selecting does not change the document
    readOnly: true,
    run: (editor) => selectTableCellContent(editor),
  },
  {
    // An empty cell's only caret position is a zero width placeholder,
    // which native movement takes two presses to cross, so leaving one is
    // handled explicitly. Everywhere else the keystroke is declined,
    // leaving the caret movement native.
    hotkey: 'left',
    readOnly: true,
    run: (editor) => escapeEmptyTableCell(editor, 'backward'),
  },
  {
    // At the very end of a table's last cell, the arrow steps out to the
    // block after the table even when one has to be added, which native
    // movement cannot do
    hotkey: 'right',
    readOnly: true,
    run: (editor) =>
      escapeEmptyTableCell(editor, 'forward') || exitTableForward(editor),
  },
  {
    // Follows the link the cursor is within, which is otherwise only
    // reachable by pressing it
    hotkey: 'mod+enter',
    // Following a link does not change the document, and a read-only entry
    // is where it is most wanted
    readOnly: true,
    run: (editor, { onOpenWikilink }) => {
      const link = resolveLinkAtCursor(editor);

      // Without a link at the cursor the keystroke belongs to whatever else
      // wants it
      if (!link) {
        return false;
      }

      if (link.type === 'wikilink') {
        onOpenWikilink?.(link.reference);

        return true;
      }

      openUrl(link.url);

      return true;
    },
  },
];
