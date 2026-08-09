import { describe, expect, it } from 'vitest';
import { QueryRule } from '../../types';
import { createQueryRule } from '../createQueryRule';
import { isCompleteQueryRule } from './isCompleteQueryRule';

const completeRule: QueryRule = {
  ...createQueryRule(),
  property: 'Name',
  operator: 'equals',
  value: 'foo',
};

describe('isCompleteQueryRule', () => {
  it('returns true for a fully configured rule', () => {
    expect(isCompleteQueryRule(completeRule)).toBe(true);
  });

  it('returns false when the property is unset', () => {
    expect(isCompleteQueryRule({ ...completeRule, property: '' })).toBe(false);
  });

  it('returns false when the operator is unset', () => {
    expect(isCompleteQueryRule({ ...completeRule, operator: '' })).toBe(false);
  });

  it('returns false when the value is unset', () => {
    expect(isCompleteQueryRule({ ...completeRule, value: undefined })).toBe(
      false,
    );
  });

  it('returns false when the value is an empty string', () => {
    expect(isCompleteQueryRule({ ...completeRule, value: '' })).toBe(false);
  });

  it('treats zero as a set value', () => {
    expect(isCompleteQueryRule({ ...completeRule, value: 0 })).toBe(true);
  });

  it('returns true for value-less operators without a value', () => {
    expect(
      isCompleteQueryRule({
        ...completeRule,
        operator: 'is-empty',
        value: undefined,
      }),
    ).toBe(true);
  });
});
