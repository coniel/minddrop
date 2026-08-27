import { Path, Range, Editor as SlateEditor, Text } from 'slate';
import { Element } from '@minddrop/ast';
import { FrameShortcuts } from '../FrameShortcuts';
import { Transforms } from '../Transforms';
import { convertElement } from '../convertElement';
import { BlockShortcut, Editor, EditorBlockElementConfig } from '../types';
import { getElementAbove, isBlockElement } from '../utils';

/**
 * Adds support for the markdown shortcuts which act on the block they are
 * typed at the start of, both those which change a block's type and those
 * which draw a container around it.
 *
 * @param editor - An editor instance.
 * @param configs - The block element configurations to enable shortcuts for.
 * @returns The editor instance with the plugin behaviour.
 */
export function withBlockShortcuts<TElement extends Element = Element>(
  editor: Editor,
  configs: EditorBlockElementConfig<TElement>[],
): Editor {
  const { apply } = editor;
  const shortcuts = resolveShortcuts(configs);

  editor.apply = (operation) => {
    // Apply the operation as normal
    apply(operation);

    // A shortcut is only ever completed by typing
    if (operation.type !== 'insert_text') {
      return;
    }

    const entry = getElementAbove(editor, { at: operation.path });

    if (!entry) {
      return;
    }

    const element = entry[0] as Element;

    // Shortcuts belong to the block, not to the inline elements within it
    if (!isBlockElement(element.type)) {
      return;
    }

    // Shortcuts belong to top level blocks, not to the internal structure
    // of one, such as a table's cells
    if (entry[1].length !== 1) {
      return;
    }

    const textNode = element.children[0];

    // The shortcut is typed at the start of the block, which is where its
    // first text node is
    if (!Text.isText(textNode)) {
      return;
    }

    const shortcut = resolveTypedShortcut(shortcuts, textNode.text);

    if (!shortcut) {
      return;
    }

    // The shortcut is only triggered by the keystroke which completes it,
    // which is the one leaving the cursor at its end
    if (
      !editor.selection ||
      !Range.isCollapsed(editor.selection) ||
      editor.selection.focus.offset !== shortcut.trigger.length
    ) {
      return;
    }

    const path = Path.parent(operation.path);

    // The shortcut text is a command rather than content, so it is removed
    Transforms.select(editor, {
      anchor: editor.selection.anchor,
      focus: SlateEditor.start(editor, operation.path),
    });
    Transforms.delete(editor);

    shortcut.apply(editor, path, element);
  };

  return editor;
}

/**
 * Collects the shortcuts which act on a block, being those of the element
 * types alongside those which draw containers.
 *
 * @param configs - The block element configurations.
 * @returns The shortcuts, longest trigger first.
 */
function resolveShortcuts<TElement extends Element>(
  configs: EditorBlockElementConfig<TElement>[],
): BlockShortcut[] {
  const typeShortcuts = configs.flatMap((config) =>
    (config.shortcuts || []).map((trigger) => ({
      trigger,
      apply: (editor: Editor, path: Path, element: Element) => {
        Transforms.setNodes<Element>(
          editor,
          convertElement(element, config.type, trigger),
          { at: path },
        );
      },
    })),
  );

  // Ordered longest first so that a trigger which starts with another one
  // is still reachable
  return [...typeShortcuts, ...FrameShortcuts].sort(
    (shortcut, other) => other.trigger.length - shortcut.trigger.length,
  );
}

/**
 * Returns the shortcut the text at the start of a block has completed.
 *
 * @param shortcuts - The available shortcuts, longest trigger first.
 * @param text - The block's leading text.
 * @returns The shortcut, or null if the text completes none.
 */
function resolveTypedShortcut(
  shortcuts: BlockShortcut[],
  text: string,
): BlockShortcut | null {
  const match = shortcuts.find((shortcut) => text.startsWith(shortcut.trigger));

  return match || null;
}
