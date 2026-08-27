import {
  DesignElement,
  getElementCompatiblePropertyTypes,
} from '@minddrop/designs';
import { PropertyType } from '@minddrop/properties';
import { FlatDesignElement } from '../../types';
import { isStaticContentElement } from '../isStaticContentElement';

/**
 * Checks whether a design property type can be rendered by an
 * element. Compatibility comes from the element type's config, or
 * the property element config for property elements.
 *
 * @param propertyType - The property type to check.
 * @param element - The element the property would be bound to.
 * @returns Whether the property can be bound to the element.
 */
export function isPropertyCompatibleWithElement(
  propertyType: PropertyType,
  element: DesignElement | FlatDesignElement,
): boolean {
  // Static elements display their own content, so they never
  // bind to a property. Element types which are always property
  // bound are never static, whatever the element carries.
  if (isStaticContentElement(element)) {
    return false;
  }

  // The element must be able to render the property type
  return getElementCompatiblePropertyTypes(element).includes(propertyType);
}
