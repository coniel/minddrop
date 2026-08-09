import { describe, expect, it } from 'vitest';
import { buildEntrySortSql } from './buildEntrySortSql';

describe('buildEntrySortSql', () => {
  it('returns the title tiebreaker with no sorts', () => {
    const result = buildEntrySortSql([]);

    expect(result.joins).toBe('');
    expect(result.orderBy).toBe('e.title COLLATE NOCASE ASC');
    expect(result.params).toEqual([]);
  });

  it('sorts pseudo-properties on the entries columns without joins', () => {
    const result = buildEntrySortSql([
      { property: 'Created', propertyType: 'created', direction: 'descending' },
    ]);

    expect(result.joins).toBe('');
    expect(result.orderBy).toBe('e.created DESC, e.title COLLATE NOCASE ASC');
  });

  it('joins entry_properties for scalar property sorts', () => {
    const result = buildEntrySortSql([
      { property: 'Amount', propertyType: 'number', direction: 'ascending' },
    ]);

    expect(result.joins).toBe(
      'LEFT JOIN entry_properties sort_0 ON sort_0.entry_id = e.id AND sort_0.property_name = ?',
    );
    expect(result.orderBy).toBe(
      '(sort_0.entry_id IS NULL) ASC, sort_0.value_number ASC, e.title COLLATE NOCASE ASC',
    );
    expect(result.params).toEqual(['Amount']);
  });

  it('sorts text properties case-insensitively', () => {
    const result = buildEntrySortSql([
      { property: 'Name', propertyType: 'text', direction: 'ascending' },
    ]);

    expect(result.orderBy).toContain('sort_0.value_text COLLATE NOCASE ASC');
  });

  it('routes integer-backed types to value_integer', () => {
    const result = buildEntrySortSql([
      { property: 'Due', propertyType: 'date', direction: 'descending' },
    ]);

    expect(result.orderBy).toContain('sort_0.value_integer DESC');
  });

  it('drops sorts on multi-value properties', () => {
    const result = buildEntrySortSql([
      { property: 'Tags', propertyType: 'select', direction: 'ascending' },
    ]);

    expect(result.joins).toBe('');
    expect(result.orderBy).toBe('e.title COLLATE NOCASE ASC');
  });

  it('aliases multiple property sorts sequentially', () => {
    const result = buildEntrySortSql([
      { property: 'Name', propertyType: 'text', direction: 'ascending' },
      { property: 'Amount', propertyType: 'number', direction: 'descending' },
    ]);

    expect(result.joins).toContain('sort_0');
    expect(result.joins).toContain('sort_1');
    expect(result.params).toEqual(['Name', 'Amount']);
  });
});
