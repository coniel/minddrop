import {
  MULTISELECT_PROPERTY_FILTER_OPERATORS,
  PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE,
} from '../../constants';
import { PropertyFilterOperator, PropertySchema } from '../../types';
import { isMultiselectProperty } from '../isMultiselectProperty';

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
  if (isMultiselectProperty(property)) {
    return MULTISELECT_PROPERTY_FILTER_OPERATORS;
  }

  return PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE[property.type];
}
