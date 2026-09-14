import {
  Properties,
  PropertiesSchema,
  PropertySchema,
} from '@minddrop/properties';
import { PropertyFilterDraft } from '../../types';

/**
 * Finds the schema of a filter's property among the given
 * properties.
 *
 * @param filter - The filter.
 * @param properties - The properties the filter's property may be among.
 * @returns The property's schema, or undefined when it is not among the properties.
 */
export function resolveFilterProperty(
  filter: PropertyFilterDraft,
  properties: PropertiesSchema,
): PropertySchema | undefined {
  // Match metadata properties by type, since their stored name
  // is translated.
  if (
    filter.propertyType !== '' &&
    Properties.constants.MetadataTypes.has(filter.propertyType)
  ) {
    return properties.find((property) => property.type === filter.propertyType);
  }

  // Match other properties by name
  return properties.find((property) => property.name === filter.property);
}
