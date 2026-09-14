import { Properties } from '@minddrop/properties';
import { PropertySchema } from '@minddrop/properties';
import {
  MULTISELECT_PROPERTY_FILTER_OPERATORS,
  PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE,
} from '../../constants';
import { PropertyFilterOperator } from '../../types';

/**
 * Returns the filter operators available for a property.
 *
 * @param property - The property schema.
 *
 * @returns The property's filter operators.
 */
export function resolvePropertyFilterOperators(
  property: PropertySchema,
): PropertyFilterOperator[] {
  // Multiselect select properties use membership operators
  if (Properties.isMultiselect(property)) {
    return MULTISELECT_PROPERTY_FILTER_OPERATORS;
  }

  // Other properties use their type's operators
  return PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE[property.type];
}
