import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { multiselectStatusProperty, statusProperty } from '../../test-utils';
import { resolveEntryColumnValue } from './resolveEntryColumnValue';

const { objectEntry1 } = DatabaseFixtures;

describe('resolveEntryColumnValue', () => {
  it('returns the value of a declared single select option', () => {
    const entry = {
      ...objectEntry1,
      properties: { ...objectEntry1.properties, Status: 'Todo' },
    };

    expect(resolveEntryColumnValue(entry, statusProperty)).toBe('Todo');
  });

  it('returns the no-value column for an undeclared value', () => {
    const entry = {
      ...objectEntry1,
      properties: { ...objectEntry1.properties, Status: 'Blocked' },
    };

    expect(resolveEntryColumnValue(entry, statusProperty)).toBe('');
  });

  it('returns the no-value column when the property is unset', () => {
    expect(resolveEntryColumnValue(objectEntry1, statusProperty)).toBe('');
  });

  it('returns the first declared option of a multi-select value', () => {
    const entry = {
      ...objectEntry1,
      properties: {
        ...objectEntry1.properties,
        Status: ['Blocked', 'Done', 'Todo'],
      },
    };

    expect(resolveEntryColumnValue(entry, multiselectStatusProperty)).toBe(
      'Done',
    );
  });

  it('returns the no-value column when no multi-select value is declared', () => {
    const entry = {
      ...objectEntry1,
      properties: { ...objectEntry1.properties, Status: ['Blocked'] },
    };

    expect(resolveEntryColumnValue(entry, multiselectStatusProperty)).toBe('');
  });

  it('follows value aliases to their renamed option', () => {
    const entry = {
      ...objectEntry1,
      properties: { ...objectEntry1.properties, Status: 'Old' },
    };

    expect(
      resolveEntryColumnValue(entry, statusProperty, { Old: 'Todo' }),
    ).toBe('Todo');
  });

  it('follows multi-select value aliases to their renamed option', () => {
    const entry = {
      ...objectEntry1,
      properties: { ...objectEntry1.properties, Status: ['Blocked', 'Old'] },
    };

    expect(
      resolveEntryColumnValue(entry, multiselectStatusProperty, {
        Old: 'Done',
      }),
    ).toBe('Done');
  });
});
