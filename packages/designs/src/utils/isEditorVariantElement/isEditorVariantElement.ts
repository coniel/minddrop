import { DesignElementStyleSource } from '../../design-element-configs';
import { getPropertyElementConfig } from '../../property-element-configs';
import { getPropertyElementVariant } from '../getPropertyElementVariant';
import { isPropertyElement } from '../isPropertyElement';

/**
 * Checks whether an element renders an editor of its bound
 * property value: a property element whose selected presentation
 * variant is an editor variant. Editor elements always render
 * during entry rendering, since an empty editor is where writing
 * starts.
 *
 * @param element - The element to check.
 * @returns Whether the element renders an editor variant.
 */
export function isEditorVariantElement(
  element: DesignElementStyleSource,
): boolean {
  // Only property elements carry presentation variants
  if (!isPropertyElement(element)) {
    return false;
  }

  // A property type without a config has no variant to resolve
  const config = getPropertyElementConfig(element.propertyType, false);

  if (!config) {
    return false;
  }

  // The selected variant declares whether it edits the value
  return Boolean(getPropertyElementVariant(config, element.variant).editor);
}
