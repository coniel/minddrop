import { PropertyType } from '@minddrop/properties';
import { uuid } from '@minddrop/utils';
import { PropertyElement } from '../design-element-configs';
import { getPropertyElementConfig } from '../property-element-configs';
import { Design, Layout } from '../types';
import { resolveAutoBinding } from '../utils/resolveAutoBinding';

/**
 * Creates a new property element for the given property type,
 * auto-bound to the first compatible unbound design property. The
 * variant's theme styles are not baked in; they apply at style
 * resolution time.
 *
 * @param propertyType - The property type to create an element for.
 * @param design - The design the element is created in.
 * @param layout - The layout the element is inserted into.
 * @returns The new property element.
 *
 * @throws {InvalidParameterError} If the property type has no property element config.
 */
export function createPropertyElement(
  propertyType: PropertyType,
  design: Design,
  layout: Layout,
): PropertyElement {
  // Get the property type's config, throwing on unknown types
  const config = getPropertyElementConfig(propertyType);

  // Instantiate the element. Omitted variant selections resolve to
  // their axis defaults. The config lookup narrows the property
  // type to one with an element shape, which the type system
  // cannot see.
  const element = {
    id: uuid(),
    type: 'property',
    propertyType,
    style: {},
  } as PropertyElement;

  // Resolve the property the element should auto-bind to
  const property = resolveAutoBinding(
    design,
    layout,
    config.bindsPropertyTypes,
  );

  // Bind the element when a compatible unbound property exists
  if (property) {
    element.property = property;
  }

  return element;
}
