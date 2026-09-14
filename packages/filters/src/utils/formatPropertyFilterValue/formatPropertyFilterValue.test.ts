import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
import { FilterAdaptersRegistry } from '../../FilterAdaptersRegistry';
import { initializeFilters } from '../../initializeFilters';
import { PropertyFilter } from '../../types';
import { formatPropertyFilterValue } from './formatPropertyFilterValue';

// Initialize translations used for the date preset labels
initializeI18n();
initializeFilters();

const dueProperty: PropertySchema = { type: 'date', name: 'Due' };
const tagsProperty: PropertySchema = { type: 'tags', name: 'Tags' };
const relatedProperty: PropertySchema = { type: 'collection', name: 'Related' };

// Returns a filter on the given property with the given value
function filterWith(
  property: PropertySchema,
  value: PropertyFilter['value'],
): PropertyFilter {
  return {
    property: property.name,
    propertyType: property.type,
    operator: 'is',
    value,
  };
}

describe('formatPropertyFilterValue', () => {
  beforeEach(() => {
    // Register a task adapter labelling by title
    FilterAdaptersRegistry.register({
      type: 'task',
      get: (id) => (id === 'task_1' ? { id, title: 'Write tests' } : null),
      getAll: () => [],
      resolveValue: () => undefined,
      label: (item) => (item as { id: string; title: string }).title,
    });
  });

  afterEach(() => {
    // Unregister the task adapter
    FilterAdaptersRegistry.clear();
  });

  it('formats a missing value as empty', () => {
    expect(
      formatPropertyFilterValue(
        filterWith(dueProperty, undefined),
        dueProperty,
      ),
    ).toBe('');
  });

  it('formats a relative date by its preset label', () => {
    expect(
      formatPropertyFilterValue(
        filterWith(dueProperty, { type: 'relative', preset: 'today' }),
        dueProperty,
      ),
    ).toBe('Today');
  });

  it('formats a day range with its count', () => {
    expect(
      formatPropertyFilterValue(
        filterWith(dueProperty, {
          type: 'relative-range',
          days: 3,
          direction: 'next',
        }),
        dueProperty,
      ),
    ).toBe('next 3 days');
  });

  it('formats an absolute date', () => {
    expect(
      formatPropertyFilterValue(
        filterWith(dueProperty, {
          type: 'absolute',
          date: new Date('2024-01-05T00:00:00.000Z'),
        }),
        dueProperty,
      ),
    ).toBe('5 Jan 2024');
  });

  it('joins list values', () => {
    expect(
      formatPropertyFilterValue(
        filterWith(tagsProperty, ['foo', 'bar']),
        tagsProperty,
      ),
    ).toBe('foo, bar');
  });

  it('formats collection values by item label', () => {
    expect(
      formatPropertyFilterValue(
        filterWith(relatedProperty, ['task_1', 'task_missing']),
        relatedProperty,
      ),
    ).toBe('Write tests, task_missing');
  });
});
