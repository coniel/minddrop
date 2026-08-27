import {
  DesignElementStyleSource,
  PropertyElement,
} from '../design-element-configs';

/**
 * Checks whether an element is a property element, optionally of
 * a specific property type.
 */
export function isPropertyElement<TElement extends DesignElementStyleSource>(
  element: TElement,
): element is TElement & PropertyElement;
export function isPropertyElement<
  TElement extends DesignElementStyleSource,
  TType extends PropertyElement['propertyType'],
>(
  element: TElement,
  propertyType: TType,
): element is TElement & Extract<PropertyElement, { propertyType: TType }>;
export function isPropertyElement(
  element: DesignElementStyleSource,
  propertyType?: PropertyElement['propertyType'],
): boolean {
  // Not a property element at all
  if (element.type !== 'property') {
    return false;
  }

  // Match the specific property type when one is given
  return !propertyType || element.propertyType === propertyType;
}
