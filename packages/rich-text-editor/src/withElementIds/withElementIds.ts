import { generateId } from '@minddrop/utils';
import { Editor } from '../types';

/**
 * Adds an ID to elements when they are created.
 *
 * @param editor The editor to which to add the plugin.
 * @returns The plugged editor.
 */
export function withElementIds(editor: Editor): Editor {
  const { apply } = editor;

  // Overwride the apply method
  // eslint-disable-next-line no-param-reassign
  editor.apply = (operation): void => {
    if (operation.type === 'split_node' && 'type' in operation.properties) {
      // An element was split, give the new element an ID
      return apply({
        ...operation,
        properties: {
          ...operation.properties,
          id: generateId(),
        },
      });
    }

    if (operation.type === 'insert_node' && 'type' in operation.node) {
      // An elements was inserted, give the element an ID
      // if it doesn't already have one.
      return apply({
        ...operation,
        node: {
          ...operation.node,
          id: operation.node.id || generateId(),
        },
      });
    }

    // No new elements were created, call the default
    // apply method.
    return apply(operation);
  };

  // Return the plugged editor
  return editor;
}
