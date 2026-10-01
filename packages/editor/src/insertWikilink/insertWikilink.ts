import { Range, Editor as SlateEditor } from 'slate';
import { generateWikilinkElement } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { Editor } from '../types';

export interface InsertWikilinkOptions {
  /**
   * The link's text. Defaults to the text the link replaces.
   */
  label?: string;

  /**
   * The part of the target the link points into.
   */
  fragment?: string;
}

/**
 * Inserts a wikilink at the cursor.
 *
 * The link's text is the given label, or the text it is inserted over, or the
 * target itself, in which case it is written back without a label. The cursor
 * is left after the link, so that typing continues alongside it rather than
 * inside it.
 *
 * @param editor - An editor instance.
 * @param reference - What the link points at, as written between its brackets.
 * @param options - The link's text and the part of the target it points into.
 */
export function insertWikilink(
  editor: Editor,
  reference: string,
  options: InsertWikilinkOptions = {},
): void {
  const { label, fragment } = options;

  if (!editor.selection) {
    return;
  }

  const isCollapsed = Range.isCollapsed(editor.selection);
  const selectedText = SlateEditor.string(editor, editor.selection);

  // Create the link. Text the link is made from is kept as its label,
  // so linking a phrase reads as that phrase rather than as what it
  // points at.
  const element = generateWikilinkElement(reference, {
    label: label || selectedText || undefined,
    fragment,
  });

  SlateEditor.withoutNormalizing(editor, () => {
    // The link takes the place of the text it is inserted over
    if (!isCollapsed) {
      Transforms.delete(editor);
    }

    // The empty text after the link is where the cursor lands, which is what
    // keeps typing alongside the link rather than inside it.
    Transforms.insertNodes(editor, [element, { text: '' }], { select: true });
    Transforms.collapse(editor, { edge: 'end' });
  });
}
