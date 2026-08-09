import { entityId } from '@minddrop/utils';
import { QueryCombinator, QueryRuleGroup } from '../types';

/**
 * Creates an empty query rule group.
 *
 * @param combinator - The group combinator, defaults to 'and'.
 *
 * @returns The new query rule group.
 */
export function createQueryRuleGroup(
  combinator: QueryCombinator = 'and',
): QueryRuleGroup {
  return {
    id: entityId('query-rule-group'),
    type: 'group',
    combinator,
    rules: [],
  };
}
