import { Range, Editor as SlateEditor } from 'slate';
import { Ast, WikilinkElement } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { Editor } from '../types';

/**
 * Inserts a wikilink at the cursor.
 *
 * The link's text is the given label, or the text it is inserted over, or the
 * reference itself, in which case it is written back without a label. The
 * cursor is left after the link, so that typing continues alongside it rather
 * than inside it.
 *
 * @param editor An editor instance.
 * @param reference What the link points at, as written between its brackets.
 * @param label The link's text, defaulting to the text it replaces.
 */
export function insertWikilink(
  editor: Editor,
  reference: string,
  label?: string,
): void {
  if (!editor.selection) {
    return;
  }

  const isCollapsed = Range.isCollapsed(editor.selection);
  const selectedText = SlateEditor.string(editor, editor.selection);

  const element = Ast.generateElement<WikilinkElement>('wikilink', {
    reference,
    // Text the link is made from is kept as its label, so linking a phrase
    // reads as that phrase rather than as what it points at
    children: [{ text: label || selectedText || reference }],
  });

  SlateEditor.withoutNormalizing(editor, () => {
    // The link takes the place of the text it is inserted over
    if (!isCollapsed) {
      Transforms.delete(editor);
    }

    // The empty text after the link is where the cursor lands, which is what
    // keeps typing alongside the link rather than inside it
    Transforms.insertNodes(editor, [element, { text: '' }], { select: true });
    Transforms.collapse(editor, { edge: 'end' });
  });
}
