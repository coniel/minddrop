import { describe, expect, it } from 'vitest';
import { createQueryRule } from '../createQueryRule';
import { createQueryRuleGroup } from '../createQueryRuleGroup';
import { removeQueryRuleNode } from './removeQueryRuleNode';

describe('removeQueryRuleNode', () => {
  it('removes a rule from the root group', () => {
    const rule = createQueryRule();
    const root = { ...createQueryRuleGroup(), rules: [rule] };

    const result = removeQueryRuleNode(root, rule.id);

    expect(result.rules).toEqual([]);
  });

  it('removes a nested group', () => {
    const nested = createQueryRuleGroup('or');
    const root = { ...createQueryRuleGroup(), rules: [nested] };

    const result = removeQueryRuleNode(root, nested.id);

    expect(result.rules).toEqual([]);
  });

  it('removes rules from nested groups', () => {
    const rule = createQueryRule();
    const nested = { ...createQueryRuleGroup('or'), rules: [rule] };
    const root = { ...createQueryRuleGroup(), rules: [nested] };

    const result = removeQueryRuleNode(root, rule.id);

    expect(result.rules[0]).toEqual({ ...nested, rules: [] });
  });

  it('does not mutate the original tree', () => {
    const rule = createQueryRule();
    const root = { ...createQueryRuleGroup(), rules: [rule] };

    removeQueryRuleNode(root, rule.id);

    expect(root.rules).toEqual([rule]);
  });
});
