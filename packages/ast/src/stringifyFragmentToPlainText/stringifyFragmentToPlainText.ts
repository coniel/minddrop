import { getElementTypeConfig } from '../ElementTypeConfigs';
import { Element, Fragment } from '../types';

/**
 * Stringifies an array of text and inline elements
 * into the plain text version of their content.
 *
 * @param fragment - The fragment to stringify.
 * @returns The plain text content of the fragment.
 */
export function stringifyFragmentToPlainText(fragment: Fragment): string {
  let result = '';

  for (const child of fragment) {
    // Child is a text element, so its text is the plain text
    if (!('type' in child)) {
      result += child.text;
      continue;
    }

    const element = child as Element;
    const config = getElementTypeConfig(element.type);

    // Stringify the element using the config's `toPlainText` method
    if (config?.toPlainText) {
      result += config.toPlainText(element);
      continue;
    }

    // Otherwise stringify the element's children
    result += stringifyFragmentToPlainText(element.children || []);
  }

  return result;
}
