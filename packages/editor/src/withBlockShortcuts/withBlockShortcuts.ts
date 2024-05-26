import { Editor as SlateEditor, Path, Range, Text } from 'slate';
import {
  Editor,
  BlockElement,
  BlockElementConfig,
  ElementConfig,
} from '../types';
import { getElementAbove } from '../utils';
import { Transforms } from '../Transforms';
import { convertElement } from '../convertElement';
import { ElementConfigsStore } from '../ElementConfigsStore';

/**
 * Adds support for block element shortcuts, enabling
 * the shortcuts of the given block element configs.
 *
 * @param editor - An editor instance.
 * @param configs - ElementConfig objects.
 * @returns The editor instance with the plugin behaviour.
 */
export function withBlockShortcuts(
  editor: Editor,
  configs: ElementConfig[],
): Editor {
  const { apply } = editor;

  // Get the configs of block level elements
  const blockConfigs = configs.filter(
    (config) => config.level === 'block',
  ) as BlockElementConfig[];

  // Create a `{ [shortcutString]: convertFn }` map of
  // shortcuts and their action.
  const shortcuts: Record<string, (element: BlockElement) => BlockElement> =
    blockConfigs.reduce((map, config) => {
      if (!config.shortcuts) {
        // If the config has no shortcuts, there is nothing to add
        return map;
      }
      //

      return config.shortcuts.reduce(
        (nextMap, shortcut) => ({
          // Shortcut converts the element into the config's element type
          [shortcut]: (element: BlockElement) =>
            convertElement(element, config.type),
          ...nextMap,
        }),
        map,
      );
    }, {});

  // eslint-disable-next-line no-param-reassign
  editor.apply = (operation) => {
    // Apply the operation as normal
    apply(operation);

    // When text is inserted, check if the inserted text is or
    // completes a shortcut string. If so, run the conversion
    // action and remove the shortcut text.
    if (operation.type === 'insert_text') {
      // Get the affected element
      const entry = getElementAbove(editor, { at: operation.path });

      if (!entry) {
        return;
      }

      const element = entry[0] as BlockElement;

      // Get the element's config
      const config = ElementConfigsStore.get(element.type);

      if (config.level !== 'block') {
        // If the element is not a block level element, stop here
        return;
      }

      // Get the affected element's child node
      const textNode = element.children[0];

      if (Text.isText(textNode)) {
        // If the first child node is a text node, check if its
        // text content starts with one of the shortcut strings.
        const match = Object.keys(shortcuts).find((shortcut) =>
          textNode.text.startsWith(shortcut),
        );

        if (match) {
          // If the text starts with a shortcut string, ensure that it was
          // just inserted/completed by making sure that th selection is
          // collapsed and focused at the end of the shortcut text.
          if (
            // There is a selection
            !editor.selection ||
            // Selection is collapsed
            !Range.isCollapsed(editor.selection) ||
            // Selection is focused at the end of the shortcut text
            editor.selection.focus.offset !== match.length
          ) {
            // If the shortcut string was not inserted/completed as
            // part of this insert, stop here.
            return;
          }

          // Select the shortcut text
          Transforms.select(editor, {
            anchor: editor.selection.anchor,
            focus: SlateEditor.start(editor, operation.path),
          });
          // Delete the selected (i.e. shortcut) text
          Transforms.delete(editor);

          // Run the conversion function to get the conversion data
          const data = shortcuts[match](element);

          // Apply the conversion data to the element to convert it
          Transforms.setNodes(editor, data, {
            at: Path.parent(operation.path),
          });
        }
      }
    }
  };

  return editor;
}
