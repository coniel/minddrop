import { BlockElement } from '../types';
import { BlockElementConfigsStore } from '../BlockElementConfigsStore';
import { InlineElementConfigsStore } from '../InlineElementConfigsStore';
import { stringifyFragmentToPlainText } from '../stringifyFragmentToPlainText';
import { isContainerBlockElement } from '../utils';

/**
 * Converts block elements into a plain text version of their content
 * separated by newlines.
 *
 * @param element - The element(s) to convert to plain text.
 * @param blockElementConfigs - Block element configurationsm, defaults to registered configs.
 * @param inlineElementConfigs - Inline element configurations, defaults to registered configs.
 * @returns The plain text representation of the elements.
 */
export function stringifyBlockElementsToPlainText(
  element: BlockElement | BlockElement[],
  blockElementConfigs = BlockElementConfigsStore.getAll(),
  inlineElementConfigs = InlineElementConfigsStore.getAll(),
): string {
  // Wrap a single element into an array
  const elements = Array.isArray(element) ? element : [element];

  return elements
    .map((element) => {
      // Get the element's configuration object
      const config = blockElementConfigs.find((c) => c.type === element.type);

      // Stringify the element using the config's `toPlainText` method
      if (config?.toPlainText) {
        return config.toPlainText(element);
      }

      // If the element is a container block, recursively convert the children
      if (isContainerBlockElement(element)) {
        return stringifyBlockElementsToPlainText(
          element.children,
          blockElementConfigs,
          inlineElementConfigs,
        );
      }

      // If the element has children, convert the children to plain text
      if (element.children) {
        return stringifyFragmentToPlainText(
          inlineElementConfigs,
          element.children,
        );
      }

      return '';
    })
    .join('\n\n');
}
