import { Path, Editor as SlateEditor } from 'slate';
import { Element, Frame, ListItemFrame, resolveFrameSpan } from '@minddrop/ast';
import { Transforms } from '../Transforms';

/**
 * Draws a container around a block.
 *
 * A block which already sits in a list item takes the new item's markers
 * rather than nesting inside it, since typing a list marker in a list is
 * asking for that list's markers to change.
 *
 * @param editor - An editor instance.
 * @param path - The path of the block.
 * @param frame - The container to draw around it.
 */
export function pushFrame(editor: SlateEditor, path: Path, frame: Frame): void {
  const elements = editor.children as Element[];
  const element = elements[path[0]];

  if (!element) {
    return;
  }

  const ancestry = element.ancestry || [];
  const innermost = ancestry[ancestry.length - 1];

  // Two list markers in a row respell the item rather than nesting a list
  // inside it
  if (frame.kind === 'list-item' && innermost?.kind === 'list-item') {
    respellListItem(editor, elements, innermost, frame);

    return;
  }

  Transforms.setNodes<Element>(
    editor,
    { ancestry: [...ancestry, frame] },
    { at: [path[0]] },
  );
}

/**
 * Gives an existing list item another item's markers, across every block the
 * item holds.
 *
 * @param editor - An editor instance.
 * @param elements - The document's blocks.
 * @param item - The item being respelled.
 * @param spelling - The item whose markers it takes.
 */
function respellListItem(
  editor: SlateEditor,
  elements: Element[],
  item: ListItemFrame,
  spelling: ListItemFrame,
): void {
  // The item keeps its identity, so its blocks stay attached to it
  const respelled: ListItemFrame = { ...spelling, id: item.id };

  SlateEditor.withoutNormalizing(editor, () => {
    resolveFrameSpan(elements, item.id).forEach((index) => {
      const ancestry = (elements[index].ancestry || []).map((frame) =>
        frame.id === item.id ? respelled : frame,
      );

      Transforms.setNodes<Element>(editor, { ancestry }, { at: [index] });
    });
  });
}
