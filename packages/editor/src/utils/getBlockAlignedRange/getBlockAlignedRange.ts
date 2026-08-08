import { Range, Editor as SlateEditor } from 'slate';
import { Editor } from '../../types';
import { getContentStartIndex } from '../getContentStartIndex';

export interface BlockRange {
  /**
   * The index of the first top level block in the range.
   */
  firstIndex: number;

  /**
   * The index of the last top level block in the range.
   */
  lastIndex: number;
}

/**
 * Gets the range of top level blocks covered by the editor's
 * selection, if the selection covers each of them whole.
 *
 * @param editor An editor instance.
 * @returns The covered block range, or null if the selection does not cover whole blocks.
 */
export function getBlockAlignedRange(editor: Editor): BlockRange | null {
  const { selection } = editor;

  // A cursor covers no blocks
  if (!selection || Range.isCollapsed(selection)) {
    return null;
  }

  const [start, end] = Range.edges(selection);
  const firstIndex = start.path[0];
  const lastIndex = end.path[0];

  // The title is not a content block, so a selection reaching into
  // it stays an ordinary text selection.
  if (firstIndex < getContentStartIndex(editor)) {
    return null;
  }

  // Blocks covered in part are covered by a text selection
  if (
    !SlateEditor.isStart(editor, start, [firstIndex]) ||
    !SlateEditor.isEnd(editor, end, [lastIndex])
  ) {
    return null;
  }

  return { firstIndex, lastIndex };
}
