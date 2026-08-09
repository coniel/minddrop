import { describe, expect, it } from 'vitest';
import { createQueryRule } from '../createQueryRule';
import { createQueryRuleGroup } from '../createQueryRuleGroup';
import { updateQueryRule } from './updateQueryRule';

describe('updateQueryRule', () => {
  it('updates the target rule', () => {
    const rule = createQueryRule();
    const root = { ...createQueryRuleGroup(), rules: [rule] };

    const result = updateQueryRule(root, rule.id, {
      property: 'Name',
      operator: 'equals',
      value: 'foo',
    });

    expect(result.rules[0]).toEqual({
      ...rule,
      property: 'Name',
      operator: 'equals',
      value: 'foo',
    });
  });

  it('updates rules in nested groups', () => {
    const rule = createQueryRule();
    const nested = { ...createQueryRuleGroup('or'), rules: [rule] };
    const root = { ...createQueryRuleGroup(), rules: [nested] };

    const result = updateQueryRule(root, rule.id, { property: 'Name' });

    expect(result.rules[0]).toEqual({
      ...nested,
      rules: [{ ...rule, property: 'Name' }],
    });
  });

  it('clears the value when explicitly set to undefined', () => {
    const rule = { ...createQueryRule(), value: 'foo' };
    const root = { ...createQueryRuleGroup(), rules: [rule] };

    const result = updateQueryRule(root, rule.id, { value: undefined });

    expect(result.rules[0]).toEqual({ ...rule, value: undefined });
  });

  it('does not mutate the original tree', () => {
    const rule = createQueryRule();
    const root = { ...createQueryRuleGroup(), rules: [rule] };

    updateQueryRule(root, rule.id, { property: 'Name' });

    expect(rule.property).toBe('');
  });
});
