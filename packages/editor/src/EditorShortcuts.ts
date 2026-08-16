import { openUrl } from '@minddrop/utils';
import { indentBlocks } from './indentBlocks';
import { outdentBlocks } from './outdentBlocks';
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
      indentBlocks(editor, getIndentTargetPaths(editor));

      return true;
    },
  },
  {
    hotkey: 'shift+tab',
    run: (editor) => {
      outdentBlocks(editor, getIndentTargetPaths(editor));

      return true;
    },
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
