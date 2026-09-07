import { PropertySchema } from '../types';

/**
 * Checks whether a property is a multi select.
 *
 * @param property - The property schema.
 * @returns Whether the property is a multi select.
 */
export function isMultiselectProperty(property: PropertySchema): boolean {
  return property.type === 'select' && !!property.multiselect;
}
