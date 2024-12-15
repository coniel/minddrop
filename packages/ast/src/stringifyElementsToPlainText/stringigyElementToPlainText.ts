import { Element } from '../types';
import { ElementTypeConfigsStore } from '../ElementTypeConfigsStore';
import { stringifyFragmentToPlainText } from '../stringifyFragmentToPlainText';
import { hasBlockChildren } from '../utils';

/**
 * Converts elements into a plain text version of their content
 * separated by newlines.
 *
 * @param element - The element(s) to convert to plain text.
 * @param elementConfigs - Element type configs, defaults to registered configs.
 * @returns The plain text representation of the elements.
 */
export function stringifyElementsToPlainText(
  element: Element | Element[],
  elementConfigs = ElementTypeConfigsStore.getAll(),
): string {
  // Wrap a single element into an array
  const elements = Array.isArray(element) ? element : [element];

  return elements
    .map((element) => {
      // Get the element's configuration object
      const config = elementConfigs.find((c) => c.type === element.type);

      // Stringify the element using the config's `toPlainText` method
      if (config?.toPlainText) {
        return config.toPlainText(element);
      }

      // If the element has block children, convert the children to plain text
      if (hasBlockChildren(elementConfigs, element)) {
        return stringifyElementsToPlainText(element.children, elementConfigs);
      }

      // If the element has inline children, convert the children to plain text
      if (element.children) {
        return stringifyFragmentToPlainText(elementConfigs, element.children);
      }

      return '';
    })
    .join('\n\n');
}
