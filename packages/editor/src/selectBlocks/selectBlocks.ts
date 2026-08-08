import { Path, Editor as SlateEditor } from 'slate';
import { Transforms } from '../Transforms';
import { Editor } from '../types';

/**
 * Selects the top level blocks between two blocks, covering both
 * of them whole.
 *
 * The selection keeps the direction implied by the given blocks,
 * so that extending it with the keyboard grows and shrinks from
 * the focused end.
 *
 * @param editor An editor instance.
 * @param anchorPath The path of the block the selection is anchored to.
 * @param focusPath The path of the block the selection is focused on.
 */
export function selectBlocks(
  editor: Editor,
  anchorPath: Path,
  focusPath: Path,
): void {
  // A selection running up the document is anchored to the end of
  // its anchor block rather than the start.
  const backward = Path.isBefore(focusPath, anchorPath);

  const anchor = backward
    ? SlateEditor.end(editor, anchorPath)
    : SlateEditor.start(editor, anchorPath);
  const focus = backward
    ? SlateEditor.start(editor, focusPath)
    : SlateEditor.end(editor, focusPath);

  Transforms.select(editor, { anchor, focus });
}
