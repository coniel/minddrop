import { Range } from 'slate';
import { Editor } from '../../../types';

/**
 * Checks whether the current selection spans from inside the
 * title element into the content below it. Assumes the title
 * feature is enabled.
 *
 * @param editor - The editor instance.
 * @returns Whether the selection spans the title and content.
 */
export function selectionSpansTitle(editor: Editor): boolean {
  // No selection means nothing is spanned
  if (!editor.selection) {
    return false;
  }

  // Whether the selection starts inside the title
  const startsInTitle = Range.start(editor.selection).path[0] === 0;

  // Whether the selection ends inside the content
  const endsInContent = Range.end(editor.selection).path[0] > 0;

  return startsInTitle && endsInContent;
}
