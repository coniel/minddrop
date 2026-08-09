import { describe, expect, it } from 'vitest';
import { createQueryRule } from '../createQueryRule';
import { createQueryRuleGroup } from '../createQueryRuleGroup';
import { addQueryRuleNode } from './addQueryRuleNode';

describe('addQueryRuleNode', () => {
  it('appends a rule to the target group', () => {
    const root = createQueryRuleGroup();
    const rule = createQueryRule();

    const result = addQueryRuleNode(root, root.id, rule);

    expect(result.rules).toEqual([rule]);
  });

  it('appends to nested groups', () => {
    const nested = createQueryRuleGroup('or');
    const root = { ...createQueryRuleGroup(), rules: [nested] };
    const rule = createQueryRule();

    const result = addQueryRuleNode(root, nested.id, rule);

    expect(result.rules[0]).toEqual({ ...nested, rules: [rule] });
  });

  it('does not mutate the original tree', () => {
    const root = createQueryRuleGroup();

    addQueryRuleNode(root, root.id, createQueryRule());

    expect(root.rules).toEqual([]);
  });

  it('returns the tree unchanged when no group matches', () => {
    const root = createQueryRuleGroup();

    const result = addQueryRuleNode(root, 'missing', createQueryRule());

    expect(result.rules).toEqual([]);
  });
});
