import { describe, expect, it } from 'vitest';
import { EntryFilterGroup } from '../../types';
import { buildEntryFilterSql } from './buildEntryFilterSql';

const group = (
  combinator: 'and' | 'or',
  filters: EntryFilterGroup['filters'],
): EntryFilterGroup => ({ combinator, filters });

describe('buildEntryFilterSql', () => {
  it('returns null for an empty group', () => {
    expect(buildEntryFilterSql(group('and', []))).toBeNull();
  });

  it('returns null when nested groups contain no filters', () => {
    expect(buildEntryFilterSql(group('and', [group('or', [])]))).toBeNull();
  });

  it('builds a text equals comparison', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Name',
          propertyType: 'text',
          operator: 'text-equals',
          value: 'foo',
        },
      ]),
    );

    expect(result?.sql).toBe(
      '(EXISTS (SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ? AND value_text = ? COLLATE NOCASE))',
    );
    expect(result?.params).toEqual(['Name', 'foo']);
  });

  it('compiles negative text operators to NOT EXISTS', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Name',
          propertyType: 'text',
          operator: 'text-not-equals',
          value: 'foo',
        },
      ]),
    );

    expect(result?.sql).toContain('NOT EXISTS');
    expect(result?.params).toEqual(['Name', 'foo']);
  });

  it('escapes LIKE wildcards in contains patterns', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Name',
          propertyType: 'text',
          operator: 'text-contains',
          value: '50%_done',
        },
      ]),
    );

    expect(result?.sql).toContain("LIKE ? ESCAPE '\\'");
    expect(result?.params).toEqual(['Name', '%50\\%\\_done%']);
  });

  it('builds starts-with and ends-with patterns', () => {
    const startsWith = buildEntryFilterSql(
      group('and', [
        {
          property: 'Name',
          propertyType: 'text',
          operator: 'text-starts-with',
          value: 'foo',
        },
      ]),
    );
    const endsWith = buildEntryFilterSql(
      group('and', [
        {
          property: 'Name',
          propertyType: 'text',
          operator: 'text-ends-with',
          value: 'foo',
        },
      ]),
    );

    expect(startsWith?.params).toEqual(['Name', 'foo%']);
    expect(endsWith?.params).toEqual(['Name', '%foo']);
  });

  it('routes number comparisons to value_number', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Amount',
          propertyType: 'number',
          operator: 'number-greater-than',
          value: 100,
        },
      ]),
    );

    expect(result?.sql).toContain('value_number > ?');
    expect(result?.params).toEqual(['Amount', 100]);
  });

  it('routes integer-backed types to value_integer', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Due',
          propertyType: 'date',
          operator: 'number-less-than',
          value: 1000,
        },
      ]),
    );

    expect(result?.sql).toContain('value_integer < ?');
  });

  it('compiles number-not-equals to NOT EXISTS', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Amount',
          propertyType: 'number',
          operator: 'number-not-equals',
          value: 5,
        },
      ]),
    );

    expect(result?.sql).toContain('NOT EXISTS');
    expect(result?.sql).toContain('value_number = ?');
  });

  it('routes membership tests to entry_property_values', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Status',
          propertyType: 'select',
          operator: 'has-value',
          value: 'Done',
        },
      ]),
    );

    expect(result?.sql).toBe(
      '(EXISTS (SELECT 1 FROM entry_property_values WHERE entry_id = e.id AND property_name = ? AND value_text = ?))',
    );
    expect(result?.params).toEqual(['Status', 'Done']);
  });

  it('routes existence tests on scalar properties to entry_properties', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Notes',
          propertyType: 'text',
          operator: 'is-empty',
        },
      ]),
    );

    expect(result?.sql).toBe(
      '(NOT EXISTS (SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ?))',
    );
    expect(result?.params).toEqual(['Notes']);
  });

  it('routes existence tests on multi-value properties to entry_property_values', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Tags',
          propertyType: 'select',
          operator: 'is-not-empty',
        },
      ]),
    );

    expect(result?.sql).toBe(
      '(EXISTS (SELECT 1 FROM entry_property_values WHERE entry_id = e.id AND property_name = ?))',
    );
  });

  it('compares the title pseudo-property against the entries column', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Title',
          propertyType: 'title',
          operator: 'text-contains',
          value: 'foo',
        },
      ]),
    );

    expect(result?.sql).toBe("(e.title LIKE ? ESCAPE '\\')");
    expect(result?.params).toEqual(['%foo%']);
  });

  it('compares created/last-modified pseudo-properties against the entries columns', () => {
    const created = buildEntryFilterSql(
      group('and', [
        {
          property: 'Created',
          propertyType: 'created',
          operator: 'number-greater-than-or-equal',
          value: 1000,
        },
      ]),
    );
    const lastModified = buildEntryFilterSql(
      group('and', [
        {
          property: 'Last modified',
          propertyType: 'last-modified',
          operator: 'number-less-than',
          value: 2000,
        },
      ]),
    );

    expect(created?.sql).toBe('(e.created >= ?)');
    expect(lastModified?.sql).toBe('(e.last_modified < ?)');
  });

  it('compares entry ID filters against the entries ID column', () => {
    const isOneOf = buildEntryFilterSql(
      group('and', [{ operator: 'id-is-one-of', entryIds: ['a', 'b'] }]),
    );
    const isNotOneOf = buildEntryFilterSql(
      group('and', [{ operator: 'id-is-not-one-of', entryIds: ['a', 'b'] }]),
    );

    expect(isOneOf?.sql).toBe('(e.id IN (?, ?))');
    expect(isOneOf?.params).toEqual(['a', 'b']);
    expect(isNotOneOf?.sql).toBe('(e.id NOT IN (?, ?))');
    expect(isNotOneOf?.params).toEqual(['a', 'b']);
  });

  it('matches nothing for an empty entry ID set, and everything for its negation', () => {
    const isOneOf = buildEntryFilterSql(
      group('and', [{ operator: 'id-is-one-of', entryIds: [] }]),
    );
    const isNotOneOf = buildEntryFilterSql(
      group('and', [{ operator: 'id-is-not-one-of', entryIds: [] }]),
    );

    expect(isOneOf?.sql).toBe('(0)');
    expect(isOneOf?.params).toEqual([]);
    expect(isNotOneOf?.sql).toBe('(1)');
    expect(isNotOneOf?.params).toEqual([]);
  });

  it('nests entry ID filters inside groups alongside property filters', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Title',
          propertyType: 'title',
          operator: 'text-equals',
          value: 'a',
        },
        { operator: 'id-is-one-of', entryIds: ['x'] },
      ]),
    );

    expect(result?.sql).toBe('(e.title = ? COLLATE NOCASE AND e.id IN (?))');
    expect(result?.params).toEqual(['a', 'x']);
  });

  it('joins group filters with the combinator and parenthesizes nested groups', () => {
    const result = buildEntryFilterSql(
      group('and', [
        {
          property: 'Title',
          propertyType: 'title',
          operator: 'text-equals',
          value: 'a',
        },
        group('or', [
          {
            property: 'Amount',
            propertyType: 'number',
            operator: 'number-equals',
            value: 1,
          },
          {
            property: 'Created',
            propertyType: 'created',
            operator: 'number-less-than',
            value: 2,
          },
        ]),
      ]),
    );

    expect(result?.sql).toBe(
      '(e.title = ? COLLATE NOCASE AND (EXISTS (SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ? AND value_number = ?) OR e.created < ?))',
    );
    expect(result?.params).toEqual(['a', 'Amount', 1, 2]);
  });
});
