import { DesignElementStyleSource } from '../../design-element-configs';
import { StyleCategory } from '../../styles';
import { getElementStyleCategory } from '../getElementStyleCategory';
import { isPropertyElement } from '../isPropertyElement';

// The style categories whose variants render the property chrome:
// value-like presentations a name label and property icon can sit
// alongside
const PropertyChromeStyleCategories: StyleCategory[] = [
  'typography',
  'field',
  'badge',
];

/**
 * Checks whether an element can render the property chrome (the
 * property name label and property icon alongside the value): a
 * property element whose selected presentation variant styles
 * through a value-like category. Which of the chrome pieces a
 * variant actually offers is decided by its editable styles list.
 *
 * @param element - The element to check.
 * @returns Whether the element can render the property chrome.
 */
export function supportsPropertyChrome(
  element: DesignElementStyleSource,
): boolean {
  // Only property elements carry chrome
  if (!isPropertyElement(element)) {
    return false;
  }

  // The selected variant's style category decides
  return PropertyChromeStyleCategories.includes(
    getElementStyleCategory(element),
  );
}
