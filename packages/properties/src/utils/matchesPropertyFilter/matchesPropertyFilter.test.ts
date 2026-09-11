import { describe, expect, it } from 'vitest';
import { PropertyFilter } from '../../types';
import { matchesPropertyFilter } from './matchesPropertyFilter';

// Reference date: mid-afternoon local time
const now = new Date(2026, 5, 15, 15, 30, 0);

// A text filter to build the others from
const textFilter: PropertyFilter = {
  property: 'Name',
  propertyType: 'text',
  operator: 'contains',
  value: 'foo',
};

describe('matchesPropertyFilter', () => {
  it('rejects operators the property type does not support', () => {
    expect(
      matchesPropertyFilter('foo', { ...textFilter, operator: 'is-true' }),
    ).toBe(false);
  });

  describe('existence', () => {
    const isEmpty: PropertyFilter = { ...textFilter, operator: 'is-empty' };

    it('treats unset, empty string and empty list values as empty', () => {
      expect(matchesPropertyFilter(undefined, isEmpty)).toBe(true);
      expect(matchesPropertyFilter(null, isEmpty)).toBe(true);
      expect(matchesPropertyFilter('', isEmpty)).toBe(true);
      expect(matchesPropertyFilter([], isEmpty)).toBe(true);
      expect(matchesPropertyFilter('foo', isEmpty)).toBe(false);
    });

    it('inverts for is-not-empty', () => {
      expect(
        matchesPropertyFilter('foo', { ...isEmpty, operator: 'is-not-empty' }),
      ).toBe(true);
      expect(
        matchesPropertyFilter('', { ...isEmpty, operator: 'is-not-empty' }),
      ).toBe(false);
    });
  });

  describe('text', () => {
    it('compares case insensitively', () => {
      expect(
        matchesPropertyFilter('FOO bar', {
          ...textFilter,
          operator: 'equals',
          value: 'foo BAR',
        }),
      ).toBe(true);
      expect(matchesPropertyFilter('a FOO b', textFilter)).toBe(true);
      expect(
        matchesPropertyFilter('Foobar', {
          ...textFilter,
          operator: 'starts-with',
        }),
      ).toBe(true);
      expect(
        matchesPropertyFilter('barFOO', {
          ...textFilter,
          operator: 'ends-with',
        }),
      ).toBe(true);
    });

    it('inverts for negative operators', () => {
      expect(
        matchesPropertyFilter('bar', {
          ...textFilter,
          operator: 'not-equals',
          value: 'bar',
        }),
      ).toBe(false);
      expect(
        matchesPropertyFilter('bar', {
          ...textFilter,
          operator: 'not-contains',
        }),
      ).toBe(true);
    });

    it('matches unset values only for negative operators', () => {
      expect(matchesPropertyFilter(undefined, textFilter)).toBe(false);
      expect(
        matchesPropertyFilter(undefined, {
          ...textFilter,
          operator: 'not-equals',
        }),
      ).toBe(true);
      expect(
        matchesPropertyFilter(undefined, {
          ...textFilter,
          operator: 'not-contains',
        }),
      ).toBe(true);
    });
  });

  describe('number', () => {
    const numberFilter: PropertyFilter = {
      property: 'Count',
      propertyType: 'number',
      operator: 'greater-than',
      value: 5,
    };

    it('compares numerically', () => {
      expect(matchesPropertyFilter(6, numberFilter)).toBe(true);
      expect(matchesPropertyFilter(5, numberFilter)).toBe(false);
      expect(
        matchesPropertyFilter(5, {
          ...numberFilter,
          operator: 'greater-than-or-equal',
        }),
      ).toBe(true);
      expect(
        matchesPropertyFilter(4, { ...numberFilter, operator: 'less-than' }),
      ).toBe(true);
      expect(
        matchesPropertyFilter(5, {
          ...numberFilter,
          operator: 'less-than-or-equal',
        }),
      ).toBe(true);
      expect(
        matchesPropertyFilter(5, { ...numberFilter, operator: 'equals' }),
      ).toBe(true);
    });

    it('matches unset values only for not-equals', () => {
      expect(matchesPropertyFilter(undefined, numberFilter)).toBe(false);
      expect(
        matchesPropertyFilter(undefined, {
          ...numberFilter,
          operator: 'not-equals',
        }),
      ).toBe(true);
    });
  });

  describe('date', () => {
    const dateFilter: PropertyFilter = {
      property: 'Due',
      propertyType: 'date',
      operator: 'is',
      value: { type: 'relative', preset: 'today' },
    };

    it('matches within the covered day for is', () => {
      expect(
        matchesPropertyFilter(new Date(2026, 5, 15, 9), dateFilter, now),
      ).toBe(true);
      expect(
        matchesPropertyFilter(new Date(2026, 5, 16, 0), dateFilter, now),
      ).toBe(false);
    });

    it('compares against the day boundaries', () => {
      const dayBefore = new Date(2026, 5, 14, 23);
      const dayAfter = new Date(2026, 5, 16, 0);
      const within = new Date(2026, 5, 15, 12);

      expect(
        matchesPropertyFilter(
          dayBefore,
          { ...dateFilter, operator: 'is-before' },
          now,
        ),
      ).toBe(true);
      expect(
        matchesPropertyFilter(
          within,
          { ...dateFilter, operator: 'is-before' },
          now,
        ),
      ).toBe(false);
      expect(
        matchesPropertyFilter(
          dayAfter,
          { ...dateFilter, operator: 'is-after' },
          now,
        ),
      ).toBe(true);
      expect(
        matchesPropertyFilter(
          within,
          { ...dateFilter, operator: 'is-after' },
          now,
        ),
      ).toBe(false);
      expect(
        matchesPropertyFilter(
          within,
          { ...dateFilter, operator: 'is-on-or-before' },
          now,
        ),
      ).toBe(true);
      expect(
        matchesPropertyFilter(
          within,
          { ...dateFilter, operator: 'is-on-or-after' },
          now,
        ),
      ).toBe(true);
    });

    it('resolves relative ranges against the reference date', () => {
      const lastWeek: PropertyFilter = {
        ...dateFilter,
        value: { type: 'relative-range', days: 7, direction: 'past' },
      };

      expect(matchesPropertyFilter(new Date(2026, 5, 9), lastWeek, now)).toBe(
        true,
      );
      expect(matchesPropertyFilter(new Date(2026, 5, 8), lastWeek, now)).toBe(
        false,
      );
    });

    it('rejects non-date values', () => {
      expect(matchesPropertyFilter('2026-06-15', dateFilter, now)).toBe(false);
    });
  });

  describe('toggle', () => {
    const toggleFilter: PropertyFilter = {
      property: 'Done',
      propertyType: 'toggle',
      operator: 'is-true',
    };

    it('requires a set toggle for is-true', () => {
      expect(matchesPropertyFilter(true, toggleFilter)).toBe(true);
      expect(matchesPropertyFilter(false, toggleFilter)).toBe(false);
      expect(matchesPropertyFilter(undefined, toggleFilter)).toBe(false);
    });

    it('treats unset toggles as off', () => {
      const isFalse: PropertyFilter = { ...toggleFilter, operator: 'is-false' };

      expect(matchesPropertyFilter(false, isFalse)).toBe(true);
      expect(matchesPropertyFilter(undefined, isFalse)).toBe(true);
      expect(matchesPropertyFilter(true, isFalse)).toBe(false);
    });
  });

  describe('select', () => {
    const selectFilter: PropertyFilter = {
      property: 'Status',
      propertyType: 'select',
      operator: 'is',
      value: 'Done',
    };

    it('compares single choice values', () => {
      expect(matchesPropertyFilter('Done', selectFilter)).toBe(true);
      expect(matchesPropertyFilter('Todo', selectFilter)).toBe(false);
      expect(
        matchesPropertyFilter('Todo', { ...selectFilter, operator: 'is-not' }),
      ).toBe(true);
    });

    it('tests membership of multiselect values', () => {
      expect(
        matchesPropertyFilter(['Todo', 'Done'], {
          ...selectFilter,
          operator: 'contains',
        }),
      ).toBe(true);
      expect(
        matchesPropertyFilter(['Todo'], {
          ...selectFilter,
          operator: 'not-contains',
        }),
      ).toBe(true);
    });

    it('accepts either value shape for either operator', () => {
      expect(matchesPropertyFilter(['Done'], selectFilter)).toBe(true);
      expect(
        matchesPropertyFilter('Done', {
          ...selectFilter,
          operator: 'contains',
        }),
      ).toBe(true);
    });

    it('matches unset values for negative operators', () => {
      expect(
        matchesPropertyFilter(undefined, {
          ...selectFilter,
          operator: 'is-not',
        }),
      ).toBe(true);
    });
  });

  describe('list', () => {
    const tagsFilter: PropertyFilter = {
      property: 'Tags',
      propertyType: 'tags',
      operator: 'contains-any',
      value: ['a', 'b'],
    };

    it('matches any of the picked items', () => {
      expect(matchesPropertyFilter(['b', 'c'], tagsFilter)).toBe(true);
      expect(matchesPropertyFilter(['c'], tagsFilter)).toBe(false);
    });

    it('matches all of the picked items', () => {
      const containsAll: PropertyFilter = {
        ...tagsFilter,
        operator: 'contains-all',
      };

      expect(matchesPropertyFilter(['a', 'b', 'c'], containsAll)).toBe(true);
      expect(matchesPropertyFilter(['a', 'c'], containsAll)).toBe(false);
    });

    it('matches none of the picked items', () => {
      const containsNone: PropertyFilter = {
        ...tagsFilter,
        operator: 'contains-none',
      };

      expect(matchesPropertyFilter(['c'], containsNone)).toBe(true);
      expect(matchesPropertyFilter(undefined, containsNone)).toBe(true);
      expect(matchesPropertyFilter(['a'], containsNone)).toBe(false);
    });

    it('matches nothing for an empty picked list', () => {
      expect(matchesPropertyFilter(['a'], { ...tagsFilter, value: [] })).toBe(
        false,
      );
    });
  });
});
