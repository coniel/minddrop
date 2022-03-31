/* eslint-disable no-param-reassign */
import { Element, Text } from 'slate';
import { generateId } from '@minddrop/utils';
import { RichTextElement } from '@minddrop/rich-text';
import { EditorApi } from '../types';

/**
 * Does something useful.
 */
export function withElementIds(editor: EditorApi): EditorApi {
  const { apply } = editor;

  // Add ID to new nodes
  editor.apply = (operation): void => {
    if (
      operation.type === 'split_node' &&
      (operation.properties as RichTextElement).type
    ) {
      return apply({
        ...operation,
        properties: {
          ...operation.properties,
          id: generateId(),
        },
      });
    }
    if (
      operation.type === 'insert_node' &&
      !Text.isText(operation.node) &&
      Element.isElement(operation.node)
    ) {
      const { node } = operation;
      if (Element.isElement(node)) {
        return apply({
          ...operation,
          node: {
            ...node,
            id: generateId(),
          },
        });
      }
    }

    return apply(operation);
  };

  return editor;
}
