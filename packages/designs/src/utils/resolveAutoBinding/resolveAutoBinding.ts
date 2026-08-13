import { PropertyType } from '@minddrop/properties';
import { getLayoutPropertyBindings } from '../../getLayoutPropertyBindings';
import { Design, Layout } from '../../types';

/**
 * Resolves the design property a new element should auto-bind to.
 * Compatible types are tried in the order given, so earlier types
 * take priority; within a type, the first unbound property in
 * design property order wins.
 *
 * @param design - The design the layout belongs to.
 * @param layout - The layout the element is inserted into.
 * @param compatiblePropertyTypes - The property types the element can render, in binding priority order.
 * @returns The property name to bind, or null when none qualifies.
 */
export function resolveAutoBinding(
  design: Design,
  layout: Layout,
  compatiblePropertyTypes: readonly PropertyType[],
): string | null {
  // Only database designs carry a property schema
  if (design.type !== 'database') {
    return null;
  }

  // Properties already bound elsewhere in the layout are skipped, so
  // no property is ever auto-used twice
  const boundProperties = new Set(
    Object.values(getLayoutPropertyBindings(layout)),
  );

  // Try each compatible type in priority order
  for (const propertyType of compatiblePropertyTypes) {
    // Find the first unbound property of the type in design
    // property order
    const property = design.properties.find(
      (schema) =>
        schema.type === propertyType && !boundProperties.has(schema.name),
    );

    if (property) {
      return property.name;
    }
  }

  return null;
}
