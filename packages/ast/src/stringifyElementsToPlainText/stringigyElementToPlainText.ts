import { getElementTypeConfig } from '../ElementTypeConfigs';
import { stringifyFragmentToPlainText } from '../stringifyFragmentToPlainText';
import { Element } from '../types';

/**
 * Converts elements into a plain text version of their content
 * separated by newlines.
 *
 * @param element - The element(s) to convert to plain text.
 * @returns The plain text representation of the elements.
 */
export function stringifyElementsToPlainText(
  element: Element | Element[],
): string {
  // Wrap a single element into an array
  const elements = Array.isArray(element) ? element : [element];

  return elements
    .map((element) => {
      const config = getElementTypeConfig(element.type);

      // Stringify the element using the config's `toPlainText` method
      if (config?.toPlainText) {
        return config.toPlainText(element);
      }

      // Otherwise stringify the element's inline content
      if (element.children) {
        return stringifyFragmentToPlainText(element.children);
      }

      return '';
    })
    .join('\n\n');
}
