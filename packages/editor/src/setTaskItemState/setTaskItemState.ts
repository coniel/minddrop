import { Editor as SlateEditor } from 'slate';
import { Element, ListItemFrame, resolveFrameSpan } from '@minddrop/ast';
import { Transforms } from '../Transforms';

/**
 * Sets the checked state of a task list item, turning a plain list item into
 * a task item where it is not one already.
 *
 * The state lives on the item's frame, which every one of its blocks carries
 * a copy of, so all of them are updated together.
 *
 * @param editor - An editor instance.
 * @param frameId - The ID of the item's frame.
 * @param checked - The item's checked state.
 * @param checkedSyntax - The character between the checkbox brackets as authored.
 */
export function setTaskItemState(
  editor: SlateEditor,
  frameId: string,
  checked: boolean,
  checkedSyntax?: string,
): void {
  const elements = editor.children as Element[];
  const span = resolveFrameSpan(elements, frameId);

  SlateEditor.withoutNormalizing(editor, () => {
    span.forEach((index) => {
      const ancestry = (elements[index].ancestry || []).map((frame) => {
        // Every other container the block sits inside is left alone
        if (frame.id !== frameId || frame.kind !== 'list-item') {
          return frame;
        }

        return applyState(frame, checked, checkedSyntax);
      });

      Transforms.setNodes<Element>(editor, { ancestry }, { at: [index] });
    });
  });
}

/**
 * Returns a list item frame carrying a checked state.
 *
 * @param frame - The item's frame.
 * @param checked - The item's checked state.
 * @param checkedSyntax - The character between the checkbox brackets as authored.
 * @returns The updated frame.
 */
function applyState(
  frame: ListItemFrame,
  checked: boolean,
  checkedSyntax?: string,
): ListItemFrame {
  const updated: ListItemFrame = { ...frame, checked };

  if (checkedSyntax) {
    updated.checkedSyntax = checkedSyntax;

    return updated;
  }

  // Without a spelling of its own the box is written back in its default
  // form
  delete updated.checkedSyntax;

  return updated;
}
