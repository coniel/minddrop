import { VALUE_LESS_QUERY_OPERATORS } from '../../constants';
import { QueryFilterNode } from '../../types';

/**
 * Checks whether a filter node is fully configured and can be
 * included in query execution. Empty string and empty list
 * values count as unset.
 *
 * @param node - The filter node to check.
 *
 * @returns Whether the filter node is complete.
 */
export function isCompleteQueryFilterNode(node: QueryFilterNode): boolean {
  // No property picked yet
  if (!node.property || !node.propertyType) {
    return false;
  }

  // No operator picked yet
  if (!node.operator) {
    return false;
  }

  // Value-less operators are complete without a value
  if (VALUE_LESS_QUERY_OPERATORS.has(node.operator)) {
    return true;
  }

  // Unset values are incomplete
  if (node.value === undefined) {
    return false;
  }

  // Empty string values are incomplete
  if (node.value === '') {
    return false;
  }

  // Empty entry ID lists are incomplete
  if (Array.isArray(node.value) && node.value.length === 0) {
    return false;
  }

  return true;
}
