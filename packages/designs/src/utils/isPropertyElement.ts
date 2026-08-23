import {
  DesignElementStyleSource,
  PropertyElement,
} from '../design-element-configs';

/**
 * Checks whether an element is a property element.
 */
export function isPropertyElement<TElement extends DesignElementStyleSource>(
  element: TElement,
): element is TElement & PropertyElement {
  return element.type === 'property';
}
