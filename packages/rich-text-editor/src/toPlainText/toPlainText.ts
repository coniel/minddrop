import { Node, Element } from 'slate';
import { RichTextElement } from '../types';
import { RichTextElementConfigsStore } from '../RichTextElementConfigsStore';

/**
 * Converts rich text elements to a plain text string.
 * Void elements are converted using their `toPlainText`method.
 * If they do not have such a method, they are omited.
 *
 * @param element - The rich text element(s) to convert to plain text.
 * @returns The plain text.
 */
export function toPlainText(
  element: RichTextElement | RichTextElement[],
): string {
  // Wrap a single element into an array
  const elements = Array.isArray(element) ? element : [element];

  return elements
    .map((element) => {
      // Get the element's configuration object
      const config = RichTextElementConfigsStore.get(element.type);

      if (config && config.toPlainText) {
        // If the element has a 'toPlainText' method, use it
        return config.toPlainText(element);
      }

      if (element.children) {
        // If the element has children, convert the children to plain text
        return Node.string(element as Element);
      }

      return '';
    })
    .join('\n\n');
}
