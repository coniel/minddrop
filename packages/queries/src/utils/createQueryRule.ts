import { entityId } from '@minddrop/utils';
import { QueryRule } from '../types';

/**
 * Creates an empty query rule with no property or operator
 * selected.
 *
 * @returns The new query rule.
 */
export function createQueryRule(): QueryRule {
  return {
    id: entityId('query-rule'),
    type: 'rule',
    property: '',
    operator: '',
  };
}
