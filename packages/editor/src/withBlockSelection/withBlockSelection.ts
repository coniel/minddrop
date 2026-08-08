import { Range } from 'slate';
import { clearBlockSelection } from '../clearBlockSelection';
import { selectBlocks } from '../selectBlocks';
import { Editor } from '../types';
import { getBlockAlignedRange, getContentStartIndex } from '../utils';

/**
 * Makes a selection which crosses a block boundary cover every
 * block it touches whole, so that blocks are selected as blocks
 * rather than as a range of text.
 *
 * The selection is corrected in `onChange` rather than as the
 * operations are applied, because Slate's own transforms set
 * exact selections which must be left as they are.
 *
 * @param editor An editor instance.
 * @returns The editor instance with the plugin behaviour applied.
 */
export function withBlockSelection(editor: Editor): Editor {
  const { onChange } = editor;

  editor.onChange = (options) => {
    // Any selection which no longer covers whole blocks has left
    // block mode, such as a cursor placed inside a block.
    if (!getBlockAlignedRange(editor)) {
      clearBlockSelection(editor);
    }

    snapSelectionToBlocks(editor);

    onChange(options);
  };

  return editor;
}

/**
 * Expands a selection spanning multiple blocks to cover each of
 * them whole.
 *
 * @param editor An editor instance.
 */
function snapSelectionToBlocks(editor: Editor): void {
  const { selection } = editor;

  // A cursor selects no blocks
  if (!selection || Range.isCollapsed(selection)) {
    return;
  }

  const [start, end] = Range.edges(selection);

  // Selections within a single block select text
  if (start.path[0] === end.path[0]) {
    return;
  }

  // A selection reaching into the title stays a text selection,
  // the title not being a content block.
  if (start.path[0] < getContentStartIndex(editor)) {
    return;
  }

  // The blocks are already covered whole
  if (getBlockAlignedRange(editor)) {
    return;
  }

  // Expanding away from the focused end would drag the selection's
  // anchor along with it.
  const backward = Range.isBackward(selection);

  selectBlocks(
    editor,
    backward ? [end.path[0]] : [start.path[0]],
    backward ? [start.path[0]] : [end.path[0]],
  );
}
