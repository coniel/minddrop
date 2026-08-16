import { Range, Editor as SlateEditor } from 'slate';
import { isUrl } from '@minddrop/utils';
import { Transforms } from '../Transforms';
import { insertLink } from '../insertLink';
import { Editor } from '../types';
import { resolveTypedLink } from '../utils';

// The character which completes markdown's inline link spelling
const LinkClosingCharacter = ')';

/**
 * Adds the ways a link is made in the editor: typing one in markdown, and
 * pasting a destination over the text it is to become the link's text.
 *
 * @param editor - An editor instance.
 * @returns The editor instance with the plugin behaviour applied.
 */
export function withLinks(editor: Editor): Editor {
  const { insertText, insertData } = editor;

  editor.insertText = (text) => {
    // Only the character which closes a link can complete one
    if (text !== LinkClosingCharacter || !editor.selection) {
      insertText(text);

      return;
    }

    const typed = resolveTypedLink(
      `${resolveTextBeforeCursor(editor)}${LinkClosingCharacter}`,
    );

    if (!typed) {
      insertText(text);

      return;
    }

    SlateEditor.withoutNormalizing(editor, () => {
      // The markdown is a spelling of the link rather than content, so it is
      // removed. The closing character was never inserted, so it is not one
      // of the characters to remove.
      Transforms.delete(editor, {
        distance: typed.length - LinkClosingCharacter.length,
        unit: 'character',
        reverse: true,
      });

      insertLink(editor, typed.url, typed.label);
    });
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    // A destination pasted over text makes that text a link to it. Pasted
    // anywhere else it is ordinary text, which the editor already reads as a
    // link when it writes it back.
    if (
      !editor.selection ||
      Range.isCollapsed(editor.selection) ||
      !isUrl(text)
    ) {
      insertData(data);

      return;
    }

    insertLink(editor, text);
  };

  return editor;
}

/**
 * Returns the text of the leaf the cursor is in, up to the cursor.
 *
 * A link is read from a single run of text, so markdown split across two
 * leaves by a mark is left as it was typed.
 *
 * @param editor - An editor instance.
 * @returns The text before the cursor.
 */
function resolveTextBeforeCursor(editor: Editor): string {
  if (!editor.selection) {
    return '';
  }

  const { focus } = editor.selection;
  const start = SlateEditor.start(editor, focus.path);

  return SlateEditor.string(editor, { anchor: start, focus });
}
