import { ElementTypeConfigsStore } from '../ElementTypeConfigsStore';
import { Fragment } from '../types';

/**
 * Stringifies an array of text and inline elements
 * into the plain text version of their content.
 *
 * @param inlineElementConfigs - The inline element configs to use, defaults to registered configs.
 * @param fragment - The fragment to stringify.
 * @returns The plain text content of the fragment.
 */
export function stringifyFragmentToPlainText(
  inlineElementConfigs = ElementTypeConfigsStore.getAll(),
  fragment: Fragment,
): string {
  let result = '';

  for (const child of fragment) {
    // Child is a text element
    if ('text' in child) {
      // Append the text content
      result += child.text;
      continue;
    }

    // Child is an inline element
    if ('type' in child) {
      // Get the element config
      const config = inlineElementConfigs.find((c) => c.type === child.type);

      if (config?.toPlainText) {
        // Stringify the element using the config's `toPlainText` method
        result += config.toPlainText(child);
        continue;
      }

      // Stringify the element's children
      result += stringifyFragmentToPlainText(
        inlineElementConfigs,
        child.children || [],
      );
    }
  }

  return result;
}
