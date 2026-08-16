import { Editor as SlateEditor, Element as SlateElement } from 'slate';
import { Element, LinkElement, WikilinkElement } from '@minddrop/ast';
import { Editor } from '../../types';

/**
 * A link the cursor can sit within, of either of the kinds which point
 * somewhere: at a web address, or at a reference.
 */
export type CursorLink = LinkElement | WikilinkElement;

/**
 * Returns the link the cursor is within.
 *
 * @param editor - An editor instance.
 * @returns The link, or null if the cursor is not in one.
 */
export function resolveLinkAtCursor(editor: Editor): CursorLink | null {
  if (!editor.selection) {
    return null;
  }

  const [entry] = SlateEditor.nodes(editor, {
    match: (node) =>
      SlateElement.isElement(node) &&
      ((node as Element).type === 'link' ||
        (node as Element).type === 'wikilink'),
  });

  return entry ? (entry[0] as CursorLink) : null;
}
