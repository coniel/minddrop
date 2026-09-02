import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryFilterNode } from '../../types';
import { convertQueryFilterNodeToEntryFilter } from './convertQueryFilterNodeToEntryFilter';

// A fully configured text filter node
const textNode: QueryFilterNode = {
  id: 'query-node_filter',
  type: 'filter',
  x: 0,
  y: 0,
  property: 'Content',
  propertyType: 'text',
  operator: 'contains',
  value: 'foo',
};

describe('convertQueryFilterNodeToEntryFilter', () => {
  beforeEach(() => {
    // Fix the clock so relative dates resolve deterministically
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for incomplete nodes', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({ ...textNode, operator: '' }),
    ).toBeNull();
  });

  it('converts text comparisons', () => {
    expect(convertQueryFilterNodeToEntryFilter(textNode)).toEqual({
      property: 'Content',
      propertyType: 'text',
      operator: 'text-contains',
      value: 'foo',
    });
  });

  it('converts number comparisons', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'number',
        operator: 'greater-than',
        value: 5,
      }),
    ).toEqual({
      property: 'Content',
      propertyType: 'number',
      operator: 'number-greater-than',
      value: 5,
    });
  });

  it('converts existence checks', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        operator: 'is-empty',
        value: undefined,
      }),
    ).toEqual({
      property: 'Content',
      propertyType: 'text',
      operator: 'is-empty',
    });
  });

  it('converts toggle checks to integer comparisons', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'toggle',
        operator: 'is-false',
        value: undefined,
      }),
    ).toEqual({
      property: 'Content',
      propertyType: 'toggle',
      operator: 'number-not-equals',
      value: 1,
    });
  });

  it('converts select comparisons to membership tests', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'select',
        operator: 'is',
        value: 'Done',
      }),
    ).toEqual({
      property: 'Content',
      propertyType: 'select',
      operator: 'has-value',
      value: 'Done',
    });
  });

  it('converts tag any-of comparisons to OR membership groups', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'tags',
        operator: 'contains-any',
        value: ['Urgent', 'Home'],
      }),
    ).toEqual({
      combinator: 'or',
      filters: [
        {
          property: 'Content',
          propertyType: 'tags',
          operator: 'has-value',
          value: 'Urgent',
        },
        {
          property: 'Content',
          propertyType: 'tags',
          operator: 'has-value',
          value: 'Home',
        },
      ],
    });
  });

  it('converts tag all-of comparisons to AND membership groups', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'tags',
        operator: 'contains-all',
        value: ['Urgent', 'Home'],
      }),
    ).toEqual({
      combinator: 'and',
      filters: [
        {
          property: 'Content',
          propertyType: 'tags',
          operator: 'has-value',
          value: 'Urgent',
        },
        {
          property: 'Content',
          propertyType: 'tags',
          operator: 'has-value',
          value: 'Home',
        },
      ],
    });
  });

  it('converts tag none-of comparisons to AND exclusion groups', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'tags',
        operator: 'contains-none',
        value: ['Urgent', 'Home'],
      }),
    ).toEqual({
      combinator: 'and',
      filters: [
        {
          property: 'Content',
          propertyType: 'tags',
          operator: 'not-has-value',
          value: 'Urgent',
        },
        {
          property: 'Content',
          propertyType: 'tags',
          operator: 'not-has-value',
          value: 'Home',
        },
      ],
    });
  });

  it('converts single item tag comparisons to a lone membership test', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'tags',
        operator: 'contains-any',
        value: ['Urgent'],
      }),
    ).toEqual({
      property: 'Content',
      propertyType: 'tags',
      operator: 'has-value',
      value: 'Urgent',
    });
  });

  it('converts collection any-of comparisons to OR membership groups', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'collection',
        operator: 'contains-any',
        value: ['entry_1', 'entry_2'],
      }),
    ).toEqual({
      combinator: 'or',
      filters: [
        {
          property: 'Content',
          propertyType: 'collection',
          operator: 'has-value',
          value: 'entry_1',
        },
        {
          property: 'Content',
          propertyType: 'collection',
          operator: 'has-value',
          value: 'entry_2',
        },
      ],
    });
  });

  it('converts collection all-of comparisons to AND membership groups', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'collection',
        operator: 'contains-all',
        value: ['entry_1', 'entry_2'],
      }),
    ).toEqual({
      combinator: 'and',
      filters: [
        {
          property: 'Content',
          propertyType: 'collection',
          operator: 'has-value',
          value: 'entry_1',
        },
        {
          property: 'Content',
          propertyType: 'collection',
          operator: 'has-value',
          value: 'entry_2',
        },
      ],
    });
  });

  it('converts collection none-of comparisons to negated AND groups', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'collection',
        operator: 'contains-none',
        value: ['entry_1', 'entry_2'],
      }),
    ).toEqual({
      combinator: 'and',
      filters: [
        {
          property: 'Content',
          propertyType: 'collection',
          operator: 'not-has-value',
          value: 'entry_1',
        },
        {
          property: 'Content',
          propertyType: 'collection',
          operator: 'not-has-value',
          value: 'entry_2',
        },
      ],
    });
  });

  it('converts single entry collection comparisons without a group', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'collection',
        operator: 'contains-any',
        value: ['entry_1'],
      }),
    ).toEqual({
      property: 'Content',
      propertyType: 'collection',
      operator: 'has-value',
      value: 'entry_1',
    });
  });

  it('expands date comparisons to day ranges', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'date',
        operator: 'is',
        value: { type: 'relative', preset: 'today' },
      }),
    ).toEqual({
      combinator: 'and',
      filters: [
        {
          property: 'Content',
          propertyType: 'date',
          operator: 'number-greater-than-or-equal',
          value: new Date('2024-06-15T00:00:00').getTime(),
        },
        {
          property: 'Content',
          propertyType: 'date',
          operator: 'number-less-than',
          value: new Date('2024-06-16T00:00:00').getTime(),
        },
      ],
    });
  });

  it('returns null when the value does not fit the property type', () => {
    expect(
      convertQueryFilterNodeToEntryFilter({
        ...textNode,
        propertyType: 'number',
        operator: 'greater-than',
        value: 'foo',
      }),
    ).toBeNull();
  });
});
