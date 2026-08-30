import { describe, expect, it } from 'vitest';
import { EntryQueryScope } from '../../types';
import { buildEntryScopesSql } from './buildEntryScopesSql';

// A scope matching all of a database's entries
const unfilteredScope: EntryQueryScope = {
  databaseId: 'database-1',
  filter: null,
};

// A scope narrowed by a text filter
const filteredScope: EntryQueryScope = {
  databaseId: 'database-2',
  filter: {
    combinator: 'and',
    filters: [
      {
        property: 'Name',
        propertyType: 'text',
        operator: 'text-equals',
        value: 'foo',
      },
    ],
  },
};

describe('buildEntryScopesSql', () => {
  it('returns null when no scopes are given', () => {
    expect(buildEntryScopesSql([])).toBeNull();
  });

  it('builds a database condition for a single scope', () => {
    const result = buildEntryScopesSql([unfilteredScope]);

    expect(result?.sql).toBe('(e.database_id = ?)');
    expect(result?.params).toEqual(['database-1']);
  });

  it("appends the scope's filter conditions", () => {
    const result = buildEntryScopesSql([filteredScope]);

    // The database condition should be narrowed by the filter
    expect(result?.sql).toContain('e.database_id = ? AND');
    expect(result?.params).toEqual(['database-2', 'Name', 'foo']);
  });

  it('ignores a filter group containing no filters', () => {
    const result = buildEntryScopesSql([
      { databaseId: 'database-1', filter: { combinator: 'and', filters: [] } },
    ]);

    expect(result?.sql).toBe('(e.database_id = ?)');
    expect(result?.params).toEqual(['database-1']);
  });

  it('combines multiple scopes with OR', () => {
    const result = buildEntryScopesSql([unfilteredScope, filteredScope]);

    // Each scope's condition should appear in an OR wrapped group
    expect(result?.sql).toMatch(/^\(\(e\.database_id = \?\) OR \(.+\)\)$/);
    expect(result?.params).toEqual(['database-1', 'database-2', 'Name', 'foo']);
  });
});
