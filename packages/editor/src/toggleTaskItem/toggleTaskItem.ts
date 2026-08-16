import { Editor as SlateEditor } from 'slate';
import { Element, resolveFrameSpan } from '@minddrop/ast';
import { setTaskItemState } from '../setTaskItemState';

/**
 * Toggles the checked state of a task list item.
 *
 * @param editor - An editor instance.
 * @param frameId - The ID of the task item's frame.
 */
export function toggleTaskItem(editor: SlateEditor, frameId: string): void {
  const elements = editor.children as Element[];
  const span = resolveFrameSpan(elements, frameId);
  const frame = (elements[span[0]]?.ancestry || []).find(
    (blockFrame) => blockFrame.id === frameId,
  );

  // Only a task item, which is a list item carrying a checked state, can be
  // toggled
  if (frame?.kind !== 'list-item' || frame.checked === undefined) {
    return;
  }

  // Toggling drops the authored spelling of the checkbox, which no longer
  // describes it
  setTaskItemState(editor, frameId, !frame.checked);
}
