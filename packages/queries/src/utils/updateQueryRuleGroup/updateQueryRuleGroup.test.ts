import { describe, expect, it } from 'vitest';
import { createQueryRuleGroup } from '../createQueryRuleGroup';
import { updateQueryRuleGroup } from './updateQueryRuleGroup';

describe('updateQueryRuleGroup', () => {
  it('updates the root group', () => {
    const root = createQueryRuleGroup();

    const result = updateQueryRuleGroup(root, root.id, { combinator: 'or' });

    expect(result.combinator).toBe('or');
  });

  it('updates nested groups', () => {
    const nested = createQueryRuleGroup();
    const root = { ...createQueryRuleGroup(), rules: [nested] };

    const result = updateQueryRuleGroup(root, nested.id, {
      combinator: 'or',
    });

    expect(result.rules[0]).toEqual({ ...nested, combinator: 'or' });
  });

  it('does not mutate the original tree', () => {
    const root = createQueryRuleGroup();

    updateQueryRuleGroup(root, root.id, { combinator: 'or' });

    expect(root.combinator).toBe('and');
  });
});
