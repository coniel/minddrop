import { PropertyType } from '@minddrop/properties';
import {
  DesignElementStyleSource,
  getElementConfig,
} from '../../design-element-configs';
import { getPropertyElementConfig } from '../../property-element-configs';
import { isPropertyElement } from '../isPropertyElement';

/**
 * Resolves the property types an element can bind to: a property
 * element's config lists them as its binding types, every other
 * element type's config as its compatible types.
 *
 * @param element - The element to resolve compatible types for.
 * @returns The property types the element can bind, in binding priority order.
 */
export function getElementCompatiblePropertyTypes(
  element: DesignElementStyleSource,
): readonly PropertyType[] {
  // Property elements bind the types their property element
  // config declares
  if (isPropertyElement(element)) {
    const config = getPropertyElementConfig(element.propertyType, false);

    // A property type without a config binds nothing
    return config?.bindsPropertyTypes ?? [];
  }

  // Other elements bind their element type's compatible types
  return getElementConfig(element.type).compatiblePropertyTypes;
}
