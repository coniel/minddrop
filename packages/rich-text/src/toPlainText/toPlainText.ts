import { Node, Element } from 'slate';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import { RichTextElement } from '../types';

/**
 * Converts rich text elements into a plain text string.
 *
 * @param document The rich text document.
 * @returns The plain text.
 */
export function toPlainText(elements: RichTextElement[]): string {
  return elements
    .map((element) => {
      if (element.children) {
        // If the element has children, convert the children to plain text
        return Node.string(element as Element);
      }

      // Get the element's configuration object
      const config = getRichTextElementConfig(element.type);

      if (config.toPlainText) {
        // If the element has a 'toPlainText' method, use it
        return config.toPlainText(element);
      }

      return '';
    })
    .join('\n\n');
}
