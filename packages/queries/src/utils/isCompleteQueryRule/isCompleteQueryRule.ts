import { VALUE_LESS_QUERY_OPERATORS } from '../../constants';
import { QueryRule } from '../../types';

/**
 * Checks whether a query rule is fully configured and can be
 * included in query execution. Empty string values count as
 * unset.
 *
 * @param rule - The rule to check.
 *
 * @returns Whether the rule is complete.
 */
export function isCompleteQueryRule(rule: QueryRule): boolean {
  // No property picked yet
  if (!rule.property) {
    return false;
  }

  // No operator picked yet
  if (!rule.operator) {
    return false;
  }

  // Value-less operators are complete without a value
  if (VALUE_LESS_QUERY_OPERATORS.has(rule.operator)) {
    return true;
  }

  // Unset values are incomplete
  if (rule.value === undefined) {
    return false;
  }

  // Empty string values are incomplete
  if (rule.value === '') {
    return false;
  }

  return true;
}
