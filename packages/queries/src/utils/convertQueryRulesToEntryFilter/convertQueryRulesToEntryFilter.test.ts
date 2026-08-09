import { describe, expect, it } from 'vitest';
import { Database, DatabaseFixtures } from '@minddrop/databases';
import { initializeI18n } from '@minddrop/i18n';
import { QueryRule, QueryRuleGroup } from '../../types';
import { createQueryRule } from '../createQueryRule';
import { createQueryRuleGroup } from '../createQueryRuleGroup';
import { convertQueryRulesToEntryFilter } from './convertQueryRulesToEntryFilter';

// Initialize translations used for the implicit title property
initializeI18n();

const { objectDatabase } = DatabaseFixtures;

// Database with one property of each filterable type
const database: Database = {
  ...objectDatabase,
  properties: [
    { type: 'text', name: 'Name' },
    { type: 'number', name: 'Amount' },
    { type: 'date', name: 'Due' },
    { type: 'toggle', name: 'Done' },
    {
      type: 'select',
      name: 'Status',
      options: [{ value: 'Done', color: 'blue' }],
    },
  ],
};

const rule = (data: Partial<QueryRule>): QueryRule => ({
  ...createQueryRule(),
  ...data,
});

const rootGroup = (
  rules: QueryRuleGroup['rules'],
  combinator: 'and' | 'or' = 'and',
): QueryRuleGroup => ({
  ...createQueryRuleGroup(combinator),
  rules,
});

describe('convertQueryRulesToEntryFilter', () => {
  it('converts text rules', () => {
    const result = convertQueryRulesToEntryFilter(
      rootGroup([
        rule({ property: 'Name', operator: 'contains', value: 'foo' }),
      ]),
      database,
    );

    expect(result).toEqual({
      combinator: 'and',
      filters: [
        {
          property: 'Name',
          propertyType: 'text',
          operator: 'text-contains',
          value: 'foo',
        },
      ],
    });
  });

  it('converts title rules via the implicit title property', () => {
    const result = convertQueryRulesToEntryFilter(
      rootGroup([
        rule({ property: 'Title', operator: 'equals', value: 'foo' }),
      ]),
      database,
    );

    expect(result.filters).toEqual([
      {
        property: 'Title',
        propertyType: 'title',
        operator: 'text-equals',
        value: 'foo',
      },
    ]);
  });

  it('converts number rules', () => {
    const result = convertQueryRulesToEntryFilter(
      rootGroup([
        rule({ property: 'Amount', operator: 'greater-than', value: 5 }),
      ]),
      database,
    );

    expect(result.filters).toEqual([
      {
        property: 'Amount',
        propertyType: 'number',
        operator: 'number-greater-than',
        value: 5,
      },
    ]);
  });

  it('expands date is rules to day ranges', () => {
    const date = new Date(2026, 5, 15, 12, 0, 0);
    const result = convertQueryRulesToEntryFilter(
      rootGroup([
        rule({
          property: 'Due',
          operator: 'is',
          value: { type: 'absolute', date },
        }),
      ]),
      database,
    );

    expect(result.filters).toEqual([
      {
        combinator: 'and',
        filters: [
          {
            property: 'Due',
            propertyType: 'date',
            operator: 'number-greater-than-or-equal',
            value: new Date(2026, 5, 15).getTime(),
          },
          {
            property: 'Due',
            propertyType: 'date',
            operator: 'number-less-than',
            value: new Date(2026, 5, 16).getTime(),
          },
        ],
      },
    ]);
  });

  it('converts date boundary rules', () => {
    const date = new Date(2026, 5, 15);
    const result = convertQueryRulesToEntryFilter(
      rootGroup([
        rule({
          property: 'Due',
          operator: 'is-before',
          value: { type: 'absolute', date },
        }),
        rule({
          property: 'Due',
          operator: 'is-on-or-after',
          value: { type: 'absolute', date },
        }),
      ]),
      database,
    );

    expect(result.filters).toEqual([
      {
        property: 'Due',
        propertyType: 'date',
        operator: 'number-less-than',
        value: date.getTime(),
      },
      {
        property: 'Due',
        propertyType: 'date',
        operator: 'number-greater-than-or-equal',
        value: date.getTime(),
      },
    ]);
  });

  it('converts toggle rules with is-false matching unset toggles', () => {
    const result = convertQueryRulesToEntryFilter(
      rootGroup([
        rule({ property: 'Done', operator: 'is-true' }),
        rule({ property: 'Done', operator: 'is-false' }),
      ]),
      database,
    );

    expect(result.filters).toEqual([
      {
        property: 'Done',
        propertyType: 'toggle',
        operator: 'number-equals',
        value: 1,
      },
      {
        property: 'Done',
        propertyType: 'toggle',
        operator: 'number-not-equals',
        value: 1,
      },
    ]);
  });

  it('converts select rules to membership filters', () => {
    const result = convertQueryRulesToEntryFilter(
      rootGroup([
        rule({ property: 'Status', operator: 'is', value: 'Done' }),
        rule({ property: 'Status', operator: 'is-not', value: 'Done' }),
      ]),
      database,
    );

    expect(result.filters).toEqual([
      {
        property: 'Status',
        propertyType: 'select',
        operator: 'has-value',
        value: 'Done',
      },
      {
        property: 'Status',
        propertyType: 'select',
        operator: 'not-has-value',
        value: 'Done',
      },
    ]);
  });

  it('converts existence rules', () => {
    const result = convertQueryRulesToEntryFilter(
      rootGroup([rule({ property: 'Status', operator: 'is-empty' })]),
      database,
    );

    expect(result.filters).toEqual([
      {
        property: 'Status',
        propertyType: 'select',
        operator: 'is-empty',
      },
    ]);
  });

  it('skips incomplete rules', () => {
    const result = convertQueryRulesToEntryFilter(
      rootGroup([
        rule({ property: 'Name' }),
        rule({ property: 'Name', operator: 'equals' }),
      ]),
      database,
    );

    expect(result.filters).toEqual([]);
  });

  it('skips rules referencing missing properties', () => {
    const result = convertQueryRulesToEntryFilter(
      rootGroup([
        rule({ property: 'Removed', operator: 'equals', value: 'foo' }),
      ]),
      database,
    );

    expect(result.filters).toEqual([]);
  });

  it('skips rules whose value does not match the property type', () => {
    const result = convertQueryRulesToEntryFilter(
      rootGroup([
        rule({ property: 'Amount', operator: 'equals', value: 'foo' }),
      ]),
      database,
    );

    expect(result.filters).toEqual([]);
  });

  it('converts nested groups preserving combinators', () => {
    const result = convertQueryRulesToEntryFilter(
      rootGroup(
        [
          {
            ...createQueryRuleGroup('and'),
            rules: [
              rule({ property: 'Name', operator: 'equals', value: 'foo' }),
            ],
          },
        ],
        'or',
      ),
      database,
    );

    expect(result).toEqual({
      combinator: 'or',
      filters: [
        {
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
      ],
    });
  });
});
