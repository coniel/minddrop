import { describe, expect, it } from 'vitest';
import { PropertyFilter, PropertyMap } from '../../types';
import { applyPropertyFilters } from './applyPropertyFilters';

const done: PropertyMap = { Status: 'Done', Priority: 1 };
const urgentTodo: PropertyMap = { Status: 'Todo', Priority: 3 };
const todo: PropertyMap = { Status: 'Todo', Priority: 1 };

const items = [done, urgentTodo, todo];

const isTodo: PropertyFilter = {
  property: 'Status',
  propertyType: 'select',
  operator: 'is',
  value: 'Todo',
};

const isUrgent: PropertyFilter = {
  property: 'Priority',
  propertyType: 'number',
  operator: 'greater-than',
  value: 2,
};

// Reads the filtered property off a property map
function resolveValue(item: PropertyMap, filter: PropertyFilter) {
  return item[filter.property];
}

describe('applyPropertyFilters', () => {
  it('returns the items unchanged without filters', () => {
    expect(applyPropertyFilters(items, [], resolveValue)).toBe(items);
  });

  it('keeps the items matching the filter', () => {
    expect(applyPropertyFilters(items, [isTodo], resolveValue)).toEqual([
      urgentTodo,
      todo,
    ]);
  });

  it('requires every filter to match', () => {
    expect(
      applyPropertyFilters(items, [isTodo, isUrgent], resolveValue),
    ).toEqual([urgentTodo]);
  });
});
