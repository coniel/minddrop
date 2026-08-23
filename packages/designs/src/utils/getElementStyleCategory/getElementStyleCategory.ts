import {
  DesignElementStyleSource,
  getElementConfig,
} from '../../design-element-configs';
import { getPropertyElementConfig } from '../../property-element-configs';
import { StyleCategory } from '../../styles';
import { getPropertyElementVariant } from '../getPropertyElementVariant';
import { isPropertyElement } from '../isPropertyElement';

/**
 * Resolves the style category an element is styled through: a
 * property element's category comes from its selected presentation
 * variant, every other element type's from its config.
 *
 * @param element - The element to resolve the category for.
 * @returns The element's style category.
 */
export function getElementStyleCategory(
  element: DesignElementStyleSource,
): StyleCategory {
  // Property elements take their category from the selected
  // presentation variant
  if (isPropertyElement(element)) {
    const config = getPropertyElementConfig(element.propertyType, false);

    if (config) {
      return getPropertyElementVariant(config, element.variant).styleCategory;
    }
  }

  // Other elements take their element type's category
  return getElementConfig(element.type).styleCategory;
}
