import { VALUE_LESS_PROPERTY_FILTER_OPERATORS } from '../../constants';
import { PropertyFilter, PropertyFilterDraft } from '../../types';

/**
 * Checks whether a filter draft is fully configured.
 *
 * @param draft - The filter draft to check.
 *
 * @returns Whether the draft is a complete filter.
 */
export function isCompletePropertyFilter(
  draft: PropertyFilterDraft,
): draft is PropertyFilterDraft & PropertyFilter {
  // No property picked yet
  if (!draft.property || !draft.propertyType) {
    return false;
  }

  // No operator picked yet
  if (!draft.operator) {
    return false;
  }

  // Value-less operators are complete without a value
  if (VALUE_LESS_PROPERTY_FILTER_OPERATORS.has(draft.operator)) {
    return true;
  }

  // Unset values are incomplete
  if (draft.value === undefined) {
    return false;
  }

  // Empty string values are incomplete
  if (draft.value === '') {
    return false;
  }

  // Empty list values are incomplete
  if (Array.isArray(draft.value) && draft.value.length === 0) {
    return false;
  }

  return true;
}
