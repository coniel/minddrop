import { Range, Editor as SlateEditor } from 'slate';
import { Ast, LinkElement } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { Editor } from '../types';

/**
 * Inserts a link at the cursor.
 *
 * The link's text is the given label, or the text it is inserted over, or
 * the destination itself when there is neither. The cursor is left after the
 * link, so that typing continues alongside it rather than inside it.
 *
 * @param editor An editor instance.
 * @param url The link's destination.
 * @param label The link's text, defaulting to the text it replaces.
 */
export function insertLink(editor: Editor, url: string, label?: string): void {
  if (!editor.selection) {
    return;
  }

  const selectedText = SlateEditor.string(editor, editor.selection);
  const isCollapsed = Range.isCollapsed(editor.selection);

  const element = Ast.generateElement<LinkElement>('link', {
    url,
    children: [{ text: label || selectedText || url }],
  });

  SlateEditor.withoutNormalizing(editor, () => {
    // The link takes the place of the text it is inserted over
    if (!isCollapsed) {
      Transforms.delete(editor);
    }

    // The empty text after the link is where the cursor lands, which is what
    // keeps typing alongside the link rather than inside it. Slate would add
    // one when it next normalizes, which is too late to select.
    Transforms.insertNodes(editor, [element, { text: '' }], { select: true });
    Transforms.collapse(editor, { edge: 'end' });
  });
}
