import { describe, expect, it } from 'vitest';
import { PropertyFilterDraft } from '../../types';
import { isCompletePropertyFilter } from './isCompletePropertyFilter';

// A fully configured filter
const completeFilter: PropertyFilterDraft = {
  property: 'Title',
  propertyType: 'title',
  operator: 'contains',
  value: 'foo',
};

describe('isCompletePropertyFilter', () => {
  it('returns true for a fully configured filter', () => {
    expect(isCompletePropertyFilter(completeFilter)).toBe(true);
  });

  it('returns false without a property', () => {
    expect(
      isCompletePropertyFilter({
        ...completeFilter,
        property: '',
        propertyType: '',
      }),
    ).toBe(false);
  });

  it('returns false without an operator', () => {
    expect(isCompletePropertyFilter({ ...completeFilter, operator: '' })).toBe(
      false,
    );
  });

  it('returns false without a value', () => {
    expect(
      isCompletePropertyFilter({ ...completeFilter, value: undefined }),
    ).toBe(false);
  });

  it('returns false with an empty string value', () => {
    expect(isCompletePropertyFilter({ ...completeFilter, value: '' })).toBe(
      false,
    );
  });

  it('returns false with an empty list value', () => {
    expect(isCompletePropertyFilter({ ...completeFilter, value: [] })).toBe(
      false,
    );
  });

  it('returns true for value-less operators without a value', () => {
    expect(
      isCompletePropertyFilter({
        ...completeFilter,
        operator: 'is-empty',
        value: undefined,
      }),
    ).toBe(true);
  });
});
